use crate::models::db::AppState;
use axum::{Router, routing::get};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(list_cases))
        .route("/{id}", get(get_case))
}

async fn list_cases() -> &'static str {
    "List of cases"
}

async fn get_case() -> &'static str {
    "Case details"
}
