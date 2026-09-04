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

### 2. Core Backend (API Server)
*   **Framework:** Spring Boot 3 (Java 21)
*   **Database:** PostgreSQL (Hosted on Supabase)

### 3. AI Analysis Service
*   **Framework:** FastAPI (Python)
*   **AI Integration:** Google Generative AI (Gemini SDK)

*For more details, see [System Design](Docs/architecture/system_design.md).*

---

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop) (Recommended for easy setup)
*   [Java 21](https://jdk.java.net/21/) & [Node.js 18+](https://nodejs.org/) & [Python 3.10+](https://www.python.org/) (For local execution)

---

## 🚀 Running the Application

### Option A: Using Docker Compose (Recommended)
```bash
docker-compose up --build
```
*See [Docker Deployment Guide](Docs/deployment/docker.md) for full instructions.*

### Option B: Running Locally (Development Mode)
*See [Local Development Setup](Docs/development/local_setup.md) and [Environment Setup](Docs/setup/environment.md).*

---

## 📊 Current Status & Known Limitations

*   **Database Integration:** Core entities (Users, Products, AnalysisResults) are fully integrated with PostgreSQL.
*   **Wishlist & Settings:** Currently utilizing **in-memory storage** (HashMap). 
*   **Search Filters:** The frontend contains UI for advanced filtering, but backend filtering logic is currently mocked.

---

## 📚 Documentation Directory
- [Environment Configuration](Docs/setup/environment.md)
- [Local Setup & Development](Docs/development/local_setup.md)
- [Docker Deployment Guide](Docs/deployment/docker.md)
- [Architecture & System Design](Docs/architecture/system_design.md)

---
*Built with ❤️ for smarter shopping decisions.*
