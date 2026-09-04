# System Design and Architecture

## How It Works

### Product Analysis Flow:

1. **User searches** for a product in the frontend
2. **Frontend sends** search query to backend `/api/products/search`
3. **Backend fetches** product details from RapidAPI (Amazon data)
4. **User clicks** "Analyze" button
5. **Frontend sends** analyze request to `/api/products/analyze`
6. **Backend**:
   - Checks if raw data is cached in PostgreSQL
   - If not cached, fetches from RapidAPI and saves to cache
   - Sends to AI service (if enabled) OR uses local parsing
7. **Python AI Service** (if enabled):
   - Receives raw product data
   - Builds analysis prompt
   - Sends to Google Gemini API
   - Returns structured analysis JSON
8. **Backend saves** analyzed product to database linked to the User
9. **Frontend displays** analysis results with charts and score

## Backend Configuration Modes

### AI Modes

1. **AI Disabled (`ai.enabled=false`)**: 
   - Uses local parsing for product data
   - No external AI service needed
   - Faster but less intelligent analysis

2. **AI Enabled (`ai.enabled=true`)**:
   - Sends product data to Python service
   - Uses Google Gemini for intelligent analysis
   - Requires Python service running on port 5001
   - Falls back to local parsing if service unavailable

## API Endpoints Overview

### Backend Endpoints:

- `GET /api/products/search?query={query}` - Search products
- `POST /api/products/analyze` - Analyze a product
  ```json
  {
    "productId": "B0ABC123",
    "productName": "Product Name",
    "brand": "Brand Name"
  }
  ```
- `GET /api/products/{productId}` - Get product details
- `GET /api/cache/{productId}` - Get cached raw data

### Python AI Service:

- `POST /analyze` - Analyze product data
  ```json
  {
    "title": "Product Title",
    "brand": "Brand",
    "price": "99.99",
    "rating": 4.5,
    "reviews": [...],
    ...
  }
  ```
