use crate::models::courses::{Course, Topic};
use crate::models::db::AppState;
use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
};
use uuid::Uuid;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(list_courses))
        .route("/{id}/topics", get(course_topics))
}

async fn list_courses(State(state): State<AppState>) -> impl IntoResponse {
    match sqlx::query_as::<_, Course>(
        "SELECT id, title, description, icon, color, created_at FROM courses ORDER BY title ASC",
    )
    .fetch_all(&state.db)
    .await
    {
        Ok(courses) => Json(courses).into_response(),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error").into_response()
        }
    }
}

async fn course_topics(State(state): State<AppState>, Path(id): Path<Uuid>) -> impl IntoResponse {
    match sqlx::query_as::<_, Topic>(
        "SELECT id, course_id, title, description, content, order_index, created_at FROM topics WHERE course_id = $1 ORDER BY order_index ASC"
    )
    .bind(id)
    .fetch_all(&state.db)
    .await
    {
        Ok(topics) => Json(topics).into_response(),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error").into_response()
        }
    }
}
