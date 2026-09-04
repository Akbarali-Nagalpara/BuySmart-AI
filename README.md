# BuySmart AI 🛒✨

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://java.oracle.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED.svg)](https://www.docker.com/)

**BuySmart AI** is an intelligent e-commerce product analysis tool. It empowers users to make data-driven purchasing decisions by leveraging real-time Amazon product data and advanced AI models (Google Gemini) to provide comprehensive product reviews, feature breakdowns, and personalized "Buy/Not Buy" recommendations.

---

## 🚀 Key Features

*   **Intelligent Product Analysis:** Uses Google Gemini to analyze product details, reviews, and specs to generate a comprehensive score and recommendation.
*   **Real-time Data Fetching:** Integrates with RapidAPI to pull live Amazon product data.
*   **User Authentication & Profiles:** Secure JWT-based authentication system with user dashboards.
*   **Search & History Tracking:** Search for products, view past analysis history, and track metrics on a personalized dashboard.
*   **Smart Wishlist:** Save products to a wishlist for future tracking (currently in-memory).
*   **Modern User Interface:** Fully responsive React frontend with Dark Mode support, complex charts (Recharts), and smooth animations (Framer Motion).
*   **Microservices Architecture:** Segregated backend (Spring Boot) and AI processing engine (Python/FastAPI) for scalability.

---

## 🏗 Architecture & Tech Stack

The application is built using a modern microservices architecture, composed of three main services:

### 1. Frontend (Client)
*   **Framework:** React 18 with Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Framer Motion
*   **Data Visualization:** Recharts
*   **State Management:** React Context API

### 2. Core Backend (API Server)
*   **Framework:** Spring Boot 3 (Java 21)
*   **Security:** Spring Security with JWT Authentication
*   **Data Access:** Spring Data JPA
*   **Database:** PostgreSQL (Hosted on Supabase)
*   **External APIs:** RapidAPI (Real-Time Amazon Data)

### 3. AI Analysis Service
*   **Framework:** FastAPI (Python)
*   **AI Integration:** Google Generative AI (Gemini SDK)
*   **Data Validation:** Pydantic

---

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop) (Recommended for easy setup)
*   [Java 21](https://jdk.java.net/21/) (For manual backend execution)
*   [Node.js 18+](https://nodejs.org/) (For manual frontend execution)
*   [Python 3.10+](https://www.python.org/) (For manual AI service execution)

---

## ⚙️ Environment Variables

The project requires specific API keys to function. Create `.env` files in the respective directories based on the provided examples.

**1. Backend (`Backend/.env`)**
```properties
DATABASE_URL=jdbc:postgresql://your-supabase-db-url:5432/postgres?sslmode=require
DATABASE_USERNAME=your_db_username
DATABASE_PASSWORD=your_db_password
RAPIDAPI_KEY=your_rapidapi_key  # From Real-Time Amazon Data on RapidAPI
```
*(Also ensure `application.properties` is configured correctly).*

**2. AI Service (`product-ai-analysis/.env`)**
```properties
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## 🚀 Running the Application

### Option A: Using Docker Compose (Recommended)

The easiest way to run the entire stack is using Docker Compose.

```bash
# From the root directory
docker-compose up --build
```
This will start:
*   Frontend at `http://localhost:80`
*   Backend at `http://localhost:8080`
*   AI Service at `http://localhost:5001`

### Option B: Running Locally (Development Mode)

**1. Start the AI Service**
```bash
cd product-ai-analysis
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5001
# Or on Windows: start.bat
```

**2. Start the Backend**
```bash
cd Backend
./mvnw spring-boot:run
```

**3. Start the Frontend**
```bash
cd Frontend
npm install
npm run dev
```
*Frontend will typically be available at `http://localhost:5173`.*

---

## 📡 API Endpoints Overview

**Authentication**
*   `POST /api/auth/register` - Create a new account
*   `POST /api/auth/login` - Authenticate and receive JWT

**Products & Analysis**
*   `GET /api/products/search?query={query}` - Search Amazon for products
*   `POST /api/products/analyze` - Trigger AI analysis for a specific product
*   `GET /api/products/{productId}` - Retrieve cached product data

**User Data (Protected)**
*   `GET /api/dashboard/stats` - Get user-specific analysis metrics
*   `GET /api/history` - Retrieve user's full analysis history
*   `GET /POST /DELETE /api/wishlist` - Manage user wishlist

**AI Service (Internal)**
*   `POST /analyze` - Internal endpoint used by the backend to communicate with Gemini.

---

## 📊 Current Status & Known Limitations

*   **Database Integration:** Core entities (Users, Products, AnalysisResults) are fully integrated with PostgreSQL.
*   **Wishlist & Settings:** Currently utilizing **in-memory storage** (HashMap). Data will reset when the backend server restarts. Future iterations will migrate this to PostgreSQL.
*   **Search Filters:** The frontend contains UI for advanced filtering (category, price range, etc.), but backend filtering logic is currently mocked/pending implementation.
*   **Email Notifications:** UI settings exist for alerts (e.g., price drops), but background cron jobs are not yet implemented.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
*Built with ❤️ for smarter shopping decisions.*
