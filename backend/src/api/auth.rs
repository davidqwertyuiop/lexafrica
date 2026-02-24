use crate::auth::Claims;
use crate::models::db::AppState;
use axum::{
    Json, Router,
    extract::{Extension, State},
    routing::{get, post},
};
use serde_json::json;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/me", get(get_current_user))
        .route("/sync", post(sync_user_profile))
}

// Example protected route using the `Extension<Claims>` extracted from our JWT middleware
async fn get_current_user(
    State(_state): State<AppState>,
    Extension(claims): Extension<Claims>,
) -> Json<serde_json::Value> {
    Json(json!({
        "status": "success",
        "user_id": claims.sub,
        "email": claims.email,
        "role": claims.role,
    }))
}

// Endpoint to sync the Supabase Auth user into our public/custom users table
async fn sync_user_profile(
    State(_state): State<AppState>,
    Extension(_claims): Extension<Claims>,
) -> Json<serde_json::Value> {
    // We would use SQLx here to upsert the user into public.users based on their UUID
    // Example: INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING

    Json(json!({
        "status": "success",
        "message": "User profile synchronized successfully"
    }))
}
