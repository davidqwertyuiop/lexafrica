use axum::{
    extract::Request,
    http::{StatusCode, header},
    middleware::Next,
    response::Response,
};
use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[allow(dead_code)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
    pub role: String,
    pub email: Option<String>,
}

#[allow(dead_code)]
pub async fn require_auth(mut req: Request, next: Next) -> Result<Response, StatusCode> {
    let auth_header = req
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok())
        .filter(|v| v.starts_with("Bearer "));

    let token = match auth_header {
        Some(header) => header.trim_start_matches("Bearer "),
        None => return Err(StatusCode::UNAUTHORIZED),
    };

    let secret = env::var("SUPABASE_JWT_SECRET").unwrap_or_else(|_| "".to_string());
    if secret.is_empty() {
        eprintln!("Authentication error: SUPABASE_JWT_SECRET is not configured");
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    let mut validation = Validation::new(Algorithm::HS256);
    // Supabase sets the audience to "authenticated"
    validation.set_audience(&["authenticated"]);

    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &validation,
    )
    .map_err(|e| {
        eprintln!("Invalid JWT token: {:?}", e);
        StatusCode::UNAUTHORIZED
    })?;

    req.extensions_mut().insert(token_data.claims);

    Ok(next.run(req).await)
}
