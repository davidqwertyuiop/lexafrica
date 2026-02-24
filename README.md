# LexAfrica Platform

LexAfrica is an AI-powered legal learning platform designed for Nigerian and African law students. It features an automated Case Law Library with AI-generated summaries and a Subject-based Study Hub.

## Project Structure

- **`backend/`**: Rust-based API using Axum and SQLx.
- **`frontend/`**: Next.js mobile-first web interface using Tailwind CSS and Framer Motion.
- **`database/`**: SQL migrations for PostgreSQL (requires `pgvector`).

## Prerequisites

- **Rust**: [Install Rust](https://www.rust-lang.org/tools/install)
- **Node.js**: [Install Node.js](https://nodejs.org/) (v18+)
- **PostgreSQL**: [Install PostgreSQL](https://www.postgresql.org/) with the `pgvector` extension.
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/).

## Getting Started

### 1. Database Setup

Create a database named `lexafrica` and run the initial migration:

```bash
psql -d lexafrica -f database/migrations/001_initial_schema.sql
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file from the template:
   ```bash
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/lexafrica
   GEMINI_API_KEY=your_key_here
   SUPABASE_JWT_SECRET=your_supabase_jwt_secret
   ```
3. Run the backend:
   ```bash
   cargo run
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## AI Worker

The backend includes an automatic AI summarization worker that runs in the background. It polls the database for new cases and uses the Gemini API to generate legal summaries.

## License

ISC
# lexafrica
