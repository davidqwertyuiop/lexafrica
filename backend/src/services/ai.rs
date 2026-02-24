#![allow(dead_code)]
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Serialize)]
struct GeminiPart {
    text: String,
}

#[derive(Serialize)]
struct GeminiContent {
    parts: Vec<GeminiPart>,
}

#[derive(Serialize)]
struct GeminiRequest {
    contents: Vec<GeminiContent>,
}

#[derive(Deserialize)]
struct GeminiResponsePart {
    text: String,
}

#[derive(Deserialize)]
struct GeminiResponseContent {
    parts: Vec<GeminiResponsePart>,
}

#[derive(Deserialize)]
struct GeminiCandidate {
    content: GeminiResponseContent,
}

#[derive(Deserialize)]
struct GeminiResponse {
    candidates: Vec<GeminiCandidate>,
}

pub struct AiService {
    client: Client,
    api_key: String,
    model: String,
}

impl AiService {
    pub fn new() -> Self {
        let api_key = env::var("GEMINI_API_KEY").unwrap_or_else(|_| "".to_string());
        // Default to gemini-1.5-flash for speed and cost-effectiveness, or allow override
        let model = env::var("GEMINI_MODEL").unwrap_or_else(|_| "gemini-1.5-flash".to_string());

        Self {
            client: Client::new(),
            api_key,
            model,
        }
    }

    pub async fn summarize_case(
        &self,
        text: &str,
    ) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        if self.api_key.is_empty() {
            return Err("GEMINI_API_KEY is not set".into());
        }

        let prompt = format!(
            "Please provide a comprehensive but concise legal summary of the following case law document. \
            Identify the key facts, main legal issues, the court's holding (decision), and the rationale. \n\n\
            Case Document:\n{}",
            text
        );

        let req_body = GeminiRequest {
            contents: vec![GeminiContent {
                parts: vec![GeminiPart { text: prompt }],
            }],
        };

        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}",
            self.model, self.api_key
        );

        // Add a timeout and setup the client request
        let res = self
            .client
            .post(&url)
            .header("Content-Type", "application/json")
            .json(&req_body)
            .send()
            .await?;

        if res.status().is_success() {
            let parsed: GeminiResponse = res.json().await?;
            if let Some(candidate) = parsed.candidates.first() {
                if let Some(part) = candidate.content.parts.first() {
                    return Ok(part.text.clone());
                }
            }
            Err("Unexpected response structure from Gemini API".into())
        } else {
            let status = res.status();
            let error_text = res.text().await?;
            Err(format!("Gemini API error: {} - {}", status, error_text).into())
        }
    }
}
