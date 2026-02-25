use crate::models::db::AppState;
use reqwest::Client;
use serde_json::json;
use sqlx::Row;
use std::time::Duration;
use tokio::time::sleep;

pub struct AiService {
    client: Client,
    api_key: String,
}

impl AiService {
    pub fn new() -> Self {
        Self {
            client: Client::new(),
            api_key: std::env::var("GEMINI_API_KEY").expect("GEMINI_API_KEY must be set"),
        }
    }

    pub async fn summarize_case(&self, content: &str) -> Result<String, String> {
        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={}",
            self.api_key
        );

        let body = json!({
            "contents": [{
                "parts": [{
                    "text": format!(
                        "You are a legal AI assistant specialized in Nigerian and African law. \
                        Summarize the following legal case clearly and concisely, \
                        highlighting the key facts, legal issues, and outcome:\n\n{}",
                        content
                    )
                }]
            }]
        });

        let response = self
            .client
            .post(&url)
            .header("Content-Type", "application/json")
            .json(&body)
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_default();
            return Err(format!("Gemini API error: {} - {}", status, error_text));
        }

        let data: serde_json::Value = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;

        let text = data["candidates"][0]["content"]["parts"][0]["text"]
            .as_str()
            .ok_or("No text in Gemini response")?
            .to_string();

        Ok(text)
    }
}

pub async fn start_summarization_worker(state: AppState) {
    println!("Starting AI Summarization Worker...");
    let ai_service = AiService::new();

    loop {
        let case_to_summarize = sqlx::query(
            "SELECT id, content FROM cases WHERE summary IS NULL ORDER BY created_at ASC LIMIT 1",
        )
        .fetch_optional(&state.db)
        .await;

        match case_to_summarize {
            Ok(Some(row)) => {
                let id: uuid::Uuid = row.get("id");
                let content: String = row.get("content");
                println!("Worker found case to summarize: {}", id);

                match ai_service.summarize_case(&content).await {
                    Ok(summary) => {
                        let update_result = sqlx::query(
                            "UPDATE cases SET summary = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2"
                        )
                        .bind(summary)
                        .bind(id)
                        .execute(&state.db)
                        .await;

                        match update_result {
                            Ok(_) => println!("Successfully summarized and saved case: {}", id),
                            Err(e) => eprintln!("Failed to save summary for case {}: {}", id, e),
                        }
                    }
                    Err(e) => {
                        eprintln!("AI Summarization failed for case {}: {}", id, e);
                        let _ = sqlx::query(
                            "UPDATE cases SET summary = 'ERROR: Summarization failed', updated_at = CURRENT_TIMESTAMP WHERE id = $1"
                        )
                        .bind(id)
                        .execute(&state.db)
                        .await;
                    }
                }
            }
            Ok(None) => {
                sleep(Duration::from_secs(30)).await;
            }
            Err(e) => {
                eprintln!("Database error in summarization worker: {}", e);
                sleep(Duration::from_secs(60)).await;
            }
        }

        sleep(Duration::from_secs(2)).await;
    }
}
