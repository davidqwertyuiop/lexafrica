use crate::auth::Claims;
use crate::models::db::AppState;
use axum::{
    Json, Router,
    extract::{Extension, State},
    routing::{get, post},
};
use serde_json::json;
use uuid::Uuid;

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
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
) -> Json<serde_json::Value> {
    let user_id = match Uuid::parse_str(&claims.sub) {
        Ok(uid) => uid,
        Err(_) => return Json(json!({"status": "error", "message": "Invalid user ID"})),
    };

    let email = claims
        .email
        .clone()
        .unwrap_or_else(|| "no-email@provided".to_string());

    let res = sqlx::query(
        "INSERT INTO profiles (id, email, full_name, role) \
         VALUES ($1, $2, $3, $4) \
         ON CONFLICT (id) DO UPDATE SET \
         email = EXCLUDED.email, \
         updated_at = CURRENT_TIMESTAMP",
    )
    .bind(user_id)
    .bind(email)
    .bind(None::<String>) // Full name can be updated later
    .bind("student") // Default role
    .execute(&state.db)
    .await;

    match res {
        Ok(_) => Json(json!({
            "status": "success",
            "message": "User profile synchronized successfully"
        })),
        Err(e) => {
            eprintln!("Failed to sync user profile: {:?}", e);
            Json(json!({
                "status": "error",
                "message": "Failed to synchronize profile"
            }))
        }
    }
}
