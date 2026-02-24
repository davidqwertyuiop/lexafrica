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
    State(state): State<AppState>,
    Json(payload): Json<ChatRequest>,
) -> impl IntoResponse {
    let ai_service = AiService::new();

    let response_text = match ai_service.ask_lexa(&payload.message).await {
        Ok(res) => res,
        Err(e) => format!("LEXA is currently troubleshooting a connection: {}", e),
    };

    // Persistence attempt (Best effort, don't fail the request if DB save fails)
    let _ = sqlx::query("INSERT INTO chat_messages (role, content) VALUES ($1, $2)")
        .bind("user")
        .bind(&payload.message)
        .execute(&state.db)
        .await;

    let _ = sqlx::query("INSERT INTO chat_messages (role, content) VALUES ($1, $2)")
        .bind("assistant")
        .bind(&response_text)
        .execute(&state.db)
        .await;

    Json(ChatResponse {
        response: response_text,
    })
}
