use reqwest::Client;
use serde_json::json;

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
