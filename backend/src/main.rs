mod api;
mod auth;
mod models;
mod services;
mod workers;

use axum::http::{Method, header};
use axum::{Router, routing::get};
use sqlx::Connection;
use sqlx::postgres::{PgConnectOptions, PgPoolOptions};
use std::env;
use std::net::SocketAddr;
use std::str::FromStr;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    // load .env file if present
    let _ = dotenvy::dotenv();

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/lexafrica".to_string());

    // Configure connection options to disable prepared statement caching
    // This resolves "prepared statement already exists" errors when using poolers like Supabase or Railway
    let connection_options = PgConnectOptions::from_str(&database_url)
        .expect("Invalid DATABASE_URL")
        .statement_cache_capacity(0);

    // Run migrations on a single connection first to ensure strict cache disabling
    // sqlx migrations sometimes use separate connections, so we run it manually here
    println!("Running database migrations...");
    let mut conn = sqlx::postgres::PgConnection::connect_with(&connection_options)
        .await
        .expect("Failed to connect for migrations");

    // Clear any existing prepared statements that might have been left by a proxy/pooler
    // This is a common workaround for "prepared statement already exists" in PgBouncer (Transaction mode)
    let _ = sqlx::query("DEALLOCATE ALL").execute(&mut conn).await;

    sqlx::migrate!("../supabase/migrations")
        .run(&mut conn)
        .await
        .expect("Failed to run migrations");

    // Explicitly drop migration connection before starting pool
    drop(conn);

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect_with(connection_options)
        .await
        .expect("could not connect to database");

    println!("Database migrations completed successfully.");

    let state = models::db::AppState { db: pool };

    // Spawn the AI summarization worker as a background task
    let worker_state = state.clone();
    tokio::spawn(async move {
        workers::ai_summarizer::start_summarization_worker(worker_state).await;
    });

    // Strict CORS configuration
    // For MVP testing this uses Any, but we will restrict it to the Next.js frontend domain for production
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::PATCH,
            Method::OPTIONS,
        ])
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE, header::ACCEPT]);

    let api_routes = Router::new()
        .nest("/cases", api::cases::router())
        .nest("/courses", api::courses::router())
        .nest("/auth", api::auth::router())
        .nest("/chat", api::chat::router())
        .with_state(state.clone());

    let app = Router::new()
        .nest("/api", api_routes)
        .layer(cors)
        .route("/", get(root));

    let port = env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse::<u16>()
        .expect("PORT must be a number");

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "LexAfrica API Gateway (Secured)"
}
