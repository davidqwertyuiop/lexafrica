use crate::models::cases::{Case, CaseSearchQuery};
use crate::models::db::AppState;
use axum::{
    Json, Router,
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
};
use uuid::Uuid;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(list_cases))
        .route("/{id}", get(get_case))
}

async fn list_cases(
    State(state): State<AppState>,
    Query(params): Query<CaseSearchQuery>,
) -> impl IntoResponse {
    let mut query = "SELECT id, title, citation, court, year, topic, difficulty, summary, content, created_at, updated_at FROM cases".to_string();
    let mut conditions = Vec::new();

    if let Some(topic) = &params.topic {
        conditions.push(format!("topic = '{}'", topic.replace("'", "''")));
    }

    if !conditions.is_empty() {
        query.push_str(" WHERE ");
        query.push_str(&conditions.join(" AND "));
    }

    query.push_str(" ORDER BY created_at DESC");

    if let Some(limit) = params.limit {
        query.push_str(&format!(" LIMIT {}", limit));
    }

    match sqlx::query_as::<_, Case>(&query).fetch_all(&state.db).await {
        Ok(cases) => Json(cases).into_response(),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error").into_response()
        }
    }
}

async fn get_case(State(state): State<AppState>, Path(id): Path<Uuid>) -> impl IntoResponse {
    match sqlx::query_as::<_, Case>(
        "SELECT id, title, citation, court, year, topic, difficulty, summary, content, created_at, updated_at FROM cases WHERE id = $1"
    )
    .bind(id)
    .fetch_one(&state.db)
    .await
    {
        Ok(case) => Json(case).into_response(),
        Err(sqlx::Error::RowNotFound) => (StatusCode::NOT_FOUND, "Case not found").into_response(),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error").into_response()
        }
    }
}
