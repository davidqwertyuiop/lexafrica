use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Course {
    pub id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub color: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Topic {
    pub id: Uuid,
    pub course_id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub content: Option<String>,
    pub order_index: i32,
    pub created_at: DateTime<Utc>,
}
