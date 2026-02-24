mod api;
mod auth;
mod models;
mod services;
mod workers;

use axum::http::{Method, header};
use axum::{Router, routing::get};
use sqlx::postgres::PgPoolOptions;
use std::env;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    // load .env file if present
    let _ = dotenvy::dotenv();

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost:5432/lexafrica".to_string());

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("could not connect to database");

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
