use crate::models::db::AppState;
use axum::{Router, routing::get};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(list_courses))
        .route("/{subject}/topics", get(course_topics))
}

async fn list_courses() -> &'static str {
    "List of courses"
}

async fn course_topics() -> &'static str {
    "Course topics"
}

#[cfg(test)]
mod tests {
    use super::*;

    // A simpler way without extra crates is to start the server on a random port
    // and use reqwest for testing, or we can use tower::ServiceExt if we add it.
    // We'll write a simple test for the endpoints using regular function calls
    // since they don't depend on state right now.

    #[tokio::test]
    async fn test_list_courses_handler() {
        let response = list_courses().await;
        assert_eq!(response, "List of courses");
    }

    #[tokio::test]
    async fn test_course_topics_handler() {
        let response = course_topics().await;
        assert_eq!(response, "Course topics");
    }
}
