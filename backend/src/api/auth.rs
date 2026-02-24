use crate::auth::Claims;
use crate::models::db::AppState;
use crate::models::user::{SyncUserRequest, UserProfile};
use axum::http::StatusCode;
use axum::{Extension, Json, Router, extract::State, response::IntoResponse, routing::post};

pub fn router() -> Router<AppState> {
    Router::new().route("/sync", post(sync_profile))
}

pub async fn sync_profile(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<SyncUserRequest>,
) -> impl IntoResponse {
    let user_id = match uuid::Uuid::parse_str(&claims.sub) {
        Ok(uid) => uid,
        Err(_) => return (StatusCode::BAD_REQUEST, "Invalid user ID in claims").into_response(),
    };

    // Upsert user profile - using the correct 'profiles' table name from migrations
    let result = sqlx::query_as::<_, UserProfile>(
        "INSERT INTO profiles (id, email, full_name, avatar_url, role)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE
         SET full_name = EXCLUDED.full_name,
             avatar_url = EXCLUDED.avatar_url,
             email = EXCLUDED.email,
             role = COALESCE(EXCLUDED.role, profiles.role)
         RETURNING *",
    )
    .bind(user_id)
    .bind(&payload.email)
    .bind(&payload.full_name)
    .bind(&payload.avatar_url)
    .bind(&payload.role) // New role field
    .fetch_one(&state.db)
    .await;

    match result {
        Ok(user) => Json(user).into_response(),
        Err(e) => {
            eprintln!("Error syncing user profile: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to sync profile").into_response()
        }
    }
}
