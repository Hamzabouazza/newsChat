# News API with FastAPI and DeepSeek LLama

A News application that combines a FastAPI wrapper around NewsAPI.org with DeepSeek-R1-Distill-LLama-70B integration via Groq API for enhanced news analysis.

## Components

1. **FastAPI Backend**: Fetches news from NewsAPI.org
2. **React Frontend**: Modern UI for searching and viewing news
3. **AI Integration**: Uses DeepSeek LLama via Groq for news analysis and insights

## Setup

### Backend

1. Clone this repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the API:
   ```
   uvicorn main:app --reload
   ```
   
### Frontend with AI Integration

1. Navigate to the React app directory:
   ```
   cd news-chatbot-react
   ```
   
2. Install dependencies:
   ```
   npm install
   ```
   
3. Create a `.env` file with your Groq API key:
   ```
   REACT_APP_GROQ_API_KEY=your_groq_api_key_here
   ```
   
4. Start the React app:
   ```
   npm start
   ```

5. For convenience, use the provided script to run both backend and frontend:
   ```
   ./run_app.sh
   ```

## AI Features

The application uses DeepSeek-R1-Distill-LLama-70B through Groq's API to provide:

- Detailed analysis of news articles
- Identification of trends and patterns across multiple articles
- Context-aware insights based on user queries

## API Endpoints

Once the server is running, access the API documentation at:
```
http://localhost:8000/docs
```

### Available Endpoints:

- `GET /`: Welcome message
- `GET /top-headlines`: Get top headlines with optional filtering
- `GET /everything`: Search through all articles with various filters
- `GET /sources`: Get available news sources
- `POST /chat`: Chat interface for natural language queries

## Query Parameters

### Top Headlines
- `country`: 2-letter ISO 3166-1 country code (default: "us")
- `category`: Category of news (business, entertainment, general, health, science, sports, technology)
- `sources`: Comma-separated string of news sources IDs
- `q`: Keywords or phrases to search for
- `pageSize`: Number of results per page (default: 20, max: 100)
- `page`: Page number (default: 1)

### Everything
- `q`: Keywords or phrases to search for
- `sources`: Comma-separated string of news sources IDs
- `domains`: Comma-separated string of domains
- `from_date`: Start date in YYYY-MM-DD format
- `to_date`: End date in YYYY-MM-DD format
- `language`: 2-letter ISO 639-1 language code (default: "en")
- `sortBy`: Sort by relevancy, popularity, or publishedAt (default: "publishedAt")
- `pageSize`: Number of results per page (default: 20, max: 100)
- `page`: Page number (default: 1)

### Sources
- `category`: Category to filter sources by
- `language`: Language to filter sources by
- `country`: Country to filter sources by

## Example Usage

```bash
# Get top US headlines
curl -X GET "http://localhost:8000/top-headlines"

# Get top technology headlines from the UK
curl -X GET "http://localhost:8000/top-headlines?country=gb&category=technology"

# Search for articles about "climate change"
curl -X GET "http://localhost:8000/everything?q=climate%20change"

# Get all news sources
curl -X GET "http://localhost:8000/sources"
``` 