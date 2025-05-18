import requests
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import datetime
import os
import jinja2
from typing import List, Dict, Any, Optional

# NewsAPI settings
API_KEY = "7bd6b81376314f4792d3774ef36f8086"
BASE_URL = "https://newsapi.org/v2"

# Email template directory
template_dir = os.path.join(os.path.dirname(__file__), "templates")
template_loader = jinja2.FileSystemLoader(searchpath=template_dir)
template_env = jinja2.Environment(loader=template_loader)


class NewsletterManager:
    def __init__(
        self,
        sender_email: str,
        sender_password: str,
        smtp_server: str = "smtp.gmail.com",
        smtp_port: int = 587,
    ):
        """
        Initialize the newsletter manager with email credentials.

        For Gmail, you need to use an App Password instead of your regular password.
        Visit https://myaccount.google.com/apppasswords to create one.
        """
        self.sender_email = sender_email
        self.sender_password = sender_password
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port

    def fetch_news(
        self,
        categories: List[str] = [
            "technology",
            "business",
            "health",
            "science",
            "entertainment",
        ],
        country: str = "us",
        articles_per_category: int = 3,
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Fetch news articles from different categories.

        Args:
            categories: List of news categories to include
            country: 2-letter country code
            articles_per_category: Number of articles to fetch per category

        Returns:
            Dictionary with categories as keys and lists of articles as values
        """
        news_by_category = {}

        for category in categories:
            params = {
                "apiKey": API_KEY,
                "category": category,
                "country": country,
                "pageSize": articles_per_category,
            }

            response = requests.get(f"{BASE_URL}/top-headlines", params=params)

            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "ok" and data.get("totalResults", 0) > 0:
                    news_by_category[category] = data.get("articles", [])
                else:
                    news_by_category[category] = []
            else:
                news_by_category[category] = []

        return news_by_category

    def fetch_trending_topics(
        self, country: str = "us", count: int = 5
    ) -> List[Dict[str, Any]]:
        """Fetch the most popular news regardless of category"""
        params = {
            "apiKey": API_KEY,
            "country": country,
            "pageSize": count,
            "sortBy": "popularity",
        }

        response = requests.get(f"{BASE_URL}/top-headlines", params=params)

        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok" and data.get("totalResults", 0) > 0:
                return data.get("articles", [])

        return []

    def generate_html_content(
        self, news_by_category: Dict[str, List[Dict]], trending_topics: List[Dict]
    ) -> str:
        """Generate HTML content for the newsletter using Jinja2 template"""
        try:
            template = template_env.get_template("newsletter_template.html")
            today = datetime.datetime.now().strftime("%A, %B %d, %Y")

            return template.render(
                news_by_category=news_by_category,
                trending_topics=trending_topics,
                date=today,
            )
        except jinja2.exceptions.TemplateNotFound:
            # Fallback to a basic template if the file is not found
            html = f"""
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
                    h1 {{ color: #333366; }}
                    h2 {{ color: #333366; border-bottom: 1px solid #eee; padding-bottom: 10px; }}
                    .article {{ margin-bottom: 15px; }}
                    .article h3 {{ margin-bottom: 5px; }}
                    .article p {{ color: #666; }}
                    .article a {{ color: #3366cc; text-decoration: none; }}
                    .article a:hover {{ text-decoration: underline; }}
                    .date {{ color: #888; font-style: italic; }}
                </style>
            </head>
            <body>
                <h1>News Digest</h1>
                <p class="date">{datetime.datetime.now().strftime("%A, %B %d, %Y")}</p>
                
                <h2>Trending Topics</h2>
            """

            # Add trending topics
            for article in trending_topics:
                html += f"""
                <div class="article">
                    <h3><a href="{article.get('url', '#')}">{article.get('title', 'No Title')}</a></h3>
                    <p>{article.get('description', 'No description available.')}</p>
                    <p>Source: {article.get('source', {}).get('name', 'Unknown')}</p>
                </div>
                """

            # Add articles by category
            for category, articles in news_by_category.items():
                html += f"""
                <h2>{category.capitalize()}</h2>
                """

                for article in articles:
                    html += f"""
                    <div class="article">
                        <h3><a href="{article.get('url', '#')}">{article.get('title', 'No Title')}</a></h3>
                        <p>{article.get('description', 'No description available.')}</p>
                        <p>Source: {article.get('source', {}).get('name', 'Unknown')}</p>
                    </div>
                    """

            html += """
            </body>
            </html>
            """

            return html

    def send_newsletter(
        self,
        recipients: List[str],
        subject: str = "Your Daily News Digest",
        categories: Optional[List[str]] = None,
        country: str = "us",
    ) -> bool:
        """
        Generate and send a newsletter to the list of recipients.

        Args:
            recipients: List of email addresses to send to
            subject: Email subject line
            categories: List of news categories (defaults to ["technology", "business", "health", "science", "entertainment"])
            country: 2-letter country code for news sources

        Returns:
            True if successful, False otherwise
        """
        if categories is None:
            categories = [
                "technology",
                "business",
                "health",
                "science",
                "entertainment",
            ]

        try:
            # Fetch news content
            news_by_category = self.fetch_news(categories=categories, country=country)
            trending_topics = self.fetch_trending_topics(country=country)

            # Generate HTML content
            html_content = self.generate_html_content(news_by_category, trending_topics)

            # Create email
            msg = MIMEMultipart()
            msg["From"] = self.sender_email
            msg["Subject"] = subject

            # Attach HTML content
            msg.attach(MIMEText(html_content, "html"))

            # Connect to server and send
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)

                # Send to each recipient
                for recipient in recipients:
                    msg["To"] = recipient
                    server.send_message(msg)
                    del msg["To"]  # Remove the previous recipient

            return True

        except Exception as e:
            print(f"Error sending newsletter: {str(e)}")
            return False


# Example usage:
# newsletter = NewsletterManager(
#     sender_email="your_email@gmail.com",
#     sender_password="your_app_password"  # Create at https://myaccount.google.com/apppasswords
# )
# newsletter.send_newsletter(["recipient1@example.com", "recipient2@example.com"])
