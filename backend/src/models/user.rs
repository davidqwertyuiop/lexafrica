use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserProfile {
    pub id: Uuid, // Links to Supabase auth.users(id)
    pub email: String,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
    pub role: String, // e.g., 'student', 'professional', 'admin'
    pub created_at: DateTime<Utc>,
}

#[derive(Deserialize)]
pub struct SyncUserRequest {
    pub email: String,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
    pub role: Option<String>,
}
