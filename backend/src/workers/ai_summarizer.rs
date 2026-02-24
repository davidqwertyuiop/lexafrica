use crate::models::db::AppState;
use crate::services::ai::AiService;
use sqlx::Row;
use std::time::Duration;
use tokio::time::sleep;

// This worker will run in the background and continuously look for cases
// that don't have a summary, summarize them using Gemini, and save the result.
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

                // Call Gemini to summarize
                match ai_service.summarize_case(&content).await {
                    Ok(summary) => {
                        // Save the summary back to the database
                        let update_result = sqlx::query(
                            "UPDATE cases SET summary = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2"
                        )
                        .bind(summary)
                        .bind(id)
                        .execute(&state.db)
                        .await;

                        match update_result {
                            Ok(_) => {
                                println!("Successfully summarized and saved case: {}", id)
                            }
                            Err(e) => {
                                eprintln!("Failed to save summary for case {}: {}", id, e)
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("AI Summarization failed for case {}: {}", id, e);
                        // Optional: Add logic here to retry or mark this case as failed
                        // so we don't infinitely retry the same failing case
                        // e.g., UPDATE cases SET summary = 'ERROR' WHERE id = $case.id;
                    }
                }
            }
            Ok(None) => {
                // No cases need summarizing, wait a bit before checking again
                sleep(Duration::from_secs(30)).await;
            }
            Err(e) => {
                eprintln!("Database error in summarization worker: {}", e);
                sleep(Duration::from_secs(60)).await;
            }
        }

        // Slight delay between successful summarizations to respect rate limits
        sleep(Duration::from_secs(2)).await;
    }
}
