# Local Development Setup Guide

This guide provides step-by-step instructions for running the BuySmart AI stack locally for development.

## Prerequisites

- Java 21
- Node.js 18+
- Python 3.10+
- A PostgreSQL database (e.g., Supabase)
- API Keys for Google Gemini, RapidAPI, and Apify

## 1. Environment Configuration

You need to set up environment variables for the Backend and the AI Service.

### Backend (`Backend/.env`)
Copy the example environment file:
```bash
cd Backend
cp .env.example .env
```
Edit `.env`:
```properties
DATABASE_URL=jdbc:postgresql://your-project.supabase.co:5432/postgres?sslmode=require
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
RAPIDAPI_KEY=your_rapidapi_key_here
APIFY_API_KEY=your_apify_api_key_here
```

### AI Service (`product-ai-analysis/.env`)
Create an environment file:
```bash
cd product-ai-analysis
echo GEMINI_API_KEY=your_gemini_api_key_here > .env
```

## 2. Running the AI Service

The Python service handles AI-powered product analysis.

```bash
cd product-ai-analysis
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5001
```
*The service will be available at: `http://localhost:5001`*

## 3. Running the Spring Boot Backend

The backend runs on Java 21 and Spring Boot.

```bash
cd Backend
./mvnw spring-boot:run
```
*(Optional) If you have a specific local profile:*
```bash
./mvnw spring-boot:run -D"spring-boot.run.arguments=--spring.profiles.active=local"
```
*The backend will be available at: `http://localhost:8080`*

## 4. Running the React Frontend

```bash
cd Frontend
npm install
npm run dev
```
*The frontend will be available at: `http://localhost:5173`*

## Troubleshooting

### "404 Not Found" on `/api/products/analyze`
- Ensure backend is running on port 8080.
- Verify CORS configuration allows your frontend origin.

### Python service connection failed
- Check if Python service is running on port 5001.
- Verify `.env` file has a valid `GEMINI_API_KEY`.
- If you cannot run the AI service, you can set `ai.enabled=false` in `Backend/src/main/resources/application.properties` to fall back to basic local parsing.
