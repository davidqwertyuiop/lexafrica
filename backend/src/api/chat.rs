use crate::models::db::AppState;
use crate::services::ai::AiService;
use axum::{Json, Router, extract::State, response::IntoResponse, routing::post};
use serde::{Deserialize, Serialize};

pub fn router() -> Router<AppState> {
    Router::new().route("/", post(chat_with_lexa))
}

#[derive(Deserialize)]
pub struct ChatRequest {
    pub message: String,
}

#[derive(Serialize)]
pub struct ChatResponse {
    pub response: String,
}

pub async fn chat_with_lexa(
    State(_state): State<AppState>,
    Json(payload): Json<ChatRequest>,
) -> impl IntoResponse {
    let ai_service = AiService::new();

    match ai_service.ask_lexa(&payload.message).await {
        Ok(response) => Json(ChatResponse { response }),
        Err(e) => Json(ChatResponse {
            response: format!("LEXA is currently troubleshooting a connection: {}", e),
        }),
    }
}
