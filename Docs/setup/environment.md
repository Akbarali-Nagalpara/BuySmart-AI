# Environment Configuration

This project requires environment variables for sensitive configuration. 

## Backend Configuration

1. Copy the example environment file:
   ```bash
   cd Backend
   cp .env.example .env
   ```

2. Edit the `.env` file and add your actual values:
   ```properties
   DATABASE_URL=jdbc:postgresql://your-host:5432/postgres?sslmode=require
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   APIFY_API_KEY=your_apify_api_key_here
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```

## AI Service Configuration

1. Create a `.env` file in the AI service directory:
   ```bash
   cd product-ai-analysis
   touch .env
   ```

2. Add your Gemini API key:
   ```properties
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Getting API Keys

- **RapidAPI Key**: Sign up at [RapidAPI](https://rapidapi.com/) and subscribe to the Real-Time Amazon Data API.
- **Apify API Key**: Create an account at [Apify](https://apify.com/) and get your API token from the settings.
- **Google Gemini API Key**: Obtain a key from the [Google AI Studio](https://aistudio.google.com/).
- **Supabase Database Connection**: Your `DATABASE_URL` should include SSL mode for Supabase connections (e.g., `?sslmode=require`).
