from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
import httpx
import os
from pydantic import BaseModel, validator
import re

app = FastAPI()

# Add CORS middleware to allow connections from the React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, including React app on port 3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define models
class NewsQuery(BaseModel):
    query: str


class SubscriptionRequest(BaseModel):
    email: str

    @validator("email")
    def validate_email(cls, v):
        # Simple email validation regex
        email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_regex, v):
            raise ValueError("Invalid email format")
        return v


class SubscriptionResponse(BaseModel):
    success: bool
    message: str


# Your News API Key
NEWS_API_KEY = "7bd6b81376314f4792d3774ef36f8086"  # NewsAPI key
NEWS_API_URL = "https://newsapi.org/v2"


@app.get("/")
def read_root():
    return {"message": "Welcome to the News API"}


@app.get("/top-headlines")
async def get_top_headlines(
    country: str = "us",
    category: Optional[str] = None,
    sources: Optional[str] = None,
    q: Optional[str] = None,
    pageSize: int = 20,
    page: int = 1,
):
    params = {
        "apiKey": NEWS_API_KEY,
        "country": country,
        "pageSize": pageSize,
        "page": page,
    }

    if category:
        params["category"] = category
    if sources:
        params["sources"] = sources
    if q:
        params["q"] = q

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NEWS_API_URL}/top-headlines", params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail="Failed to fetch top headlines"
        )

    return response.json()


@app.get("/everything")
async def get_everything(
    q: str,
    sources: Optional[str] = None,
    domains: Optional[str] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    language: str = "en",
    sortBy: str = "publishedAt",
    pageSize: int = 20,
    page: int = 1,
):
    params = {
        "apiKey": NEWS_API_KEY,
        "q": q,
        "language": language,
        "sortBy": sortBy,
        "pageSize": pageSize,
        "page": page,
    }

    if sources:
        params["sources"] = sources
    if domains:
        params["domains"] = domains
    if from_date:
        params["from"] = from_date
    if to_date:
        params["to"] = to_date

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NEWS_API_URL}/everything", params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail="Failed to fetch articles"
        )

    return response.json()


@app.get("/sources")
async def get_sources(
    category: Optional[str] = None,
    language: Optional[str] = None,
    country: Optional[str] = None,
):
    params = {"apiKey": NEWS_API_KEY}

    if category:
        params["category"] = category
    if language:
        params["language"] = language
    if country:
        params["country"] = country

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{NEWS_API_URL}/sources", params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail="Failed to fetch sources"
        )

    return response.json()


@app.post("/chat")
async def chat(query: NewsQuery):
    """
    Chat interface for querying news with natural language
    """
    try:
        # Search for news articles based on the query
        params = {
            "apiKey": NEWS_API_KEY,
            "q": query.query,
            "pageSize": 5,  # Limit to 5 articles for display in chat
            "sortBy": "publishedAt",
            "language": "en",
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(f"{NEWS_API_URL}/everything", params=params)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail="Failed to fetch news"
            )

        data = response.json()
        articles = data.get("articles", [])

        # Generate a response based on the query and articles
        if articles:
            answer = f"Here are some articles about '{query.query}':"
        else:
            answer = f"I couldn't find any articles about '{query.query}'. Try a different search term."

        return {"answer": answer, "articles": articles}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# New endpoint for newsletter subscription
@app.post("/subscribe", response_model=SubscriptionResponse)
async def subscribe_to_newsletter(request: SubscriptionRequest):
    try:
        # Here you would typically:
        # 1. Validate the email
        # 2. Store it in a database
        # 3. Send a confirmation email

        # For now, we'll just simulate a successful subscription
        # In a real application, you'd add the email to your database or newsletter service

        # Log the subscription for demonstration
        print(f"New subscription: {request.email}")

        return SubscriptionResponse(
            success=True, message="Successfully subscribed to the newsletter"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to subscribe: {str(e)}")
