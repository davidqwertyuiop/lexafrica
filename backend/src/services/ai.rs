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

const LEXA_SYSTEM_PROMPT: &str = "You are LEXA, a sophisticated legal AI assistant dedicated to helping Nigerian and African law students. \
    Your goal is to provide clear, authoritative, and educational explanations of legal concepts, case law, and statutes. \
    When answering: \n\
    1. Be precise and cite specific cases or sections of law where possible.\n\
    2. Use a professional but encouraging tutor-like tone.\n\
    3. If a question is outside the scope of law or African legal studies, gently guide the user back to legal topics.\n\
    4. Provide structured responses using bullet points or numbered lists for complex topics.";

pub struct AiService {
    client: Client,
    api_key: String,
    model: String,
}

impl AiService {
    pub fn new() -> Self {
        let api_key = env::var("GEMINI_API_KEY").unwrap_or_else(|_| "".to_string());
        // Default to gemini-1.5-flash for speed and cost-effectiveness
        let model = env::var("GEMINI_MODEL").unwrap_or_else(|_| "gemini-1.5-flash".to_string());

        Self {
            client: Client::new(),
            api_key,
            model,
        }
    }

    pub async fn ask_lexa(
        &self,
        question: &str,
    ) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        let prompt = format!("{}\n\nUser Question: {}", LEXA_SYSTEM_PROMPT, question);
        self.generate_content(&prompt).await
    }

    pub async fn summarize_case(
        &self,
        text: &str,
    ) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        let prompt = format!(
            "You are LEXA. Please provide a comprehensive but concise legal summary of the following case law document. \
            Identify the key facts, main legal issues, the court's holding (decision), and the rationale. \n\n\
            Case Document:\n{}",
            text
        );
        self.generate_content(&prompt).await
    }

    async fn generate_content(
        &self,
        prompt: &str,
    ) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        if self.api_key.is_empty() {
            return Err("GEMINI_API_KEY is not set".into());
        }

        let req_body = GeminiRequest {
            contents: vec![GeminiContent {
                parts: vec![GeminiPart {
                    text: prompt.to_string(),
                }],
            }],
        };

        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}",
            self.model, self.api_key
        );

        let res = self
            .client
            .post(&url)
            .header("Content-Type", "application/json")
            .json(&req_body)
            .send()
            .await?;

        if res.status().is_success() {
            let parsed: GeminiResponse = res.json().await?;
            if let Some(part) = parsed
                .candidates
                .first()
                .and_then(|c| c.content.parts.first())
            {
                return Ok(part.text.clone());
            }
            Err("Unexpected response structure from Gemini API".into())
        } else {
            let status = res.status();
            let error_text = res.text().await?;
            Err(format!("Gemini API error: {} - {}", status, error_text).into())
        }
    }
}
