#![allow(dead_code)]
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Case {
    pub id: Uuid,
    pub title: String,
    pub citation: String,
    pub court: String,
    pub year: i32,
    pub topic: Option<String>,
    pub difficulty: Option<String>,
    pub summary: Option<String>,
    pub content: String,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CaseSearchQuery {
    pub q: Option<String>,
    pub topic: Option<String>,
    pub limit: Option<i64>,
}
