#![allow(dead_code)]
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Case {
    pub id: Uuid,
    pub title: String,
    pub citation: String,
    pub court: String,
    pub year: i32,
    pub summary: Option<String>,
    pub content: String,
    // Omitting the vector embedding struct field directly unless needed for clients
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CaseSearchQuery {
    pub q: String,
    pub limit: Option<i64>,
}
