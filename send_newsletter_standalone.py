#!/usr/bin/env python3
import os
import sys
import argparse
from newsletter import NewsletterManager
from datetime import datetime


def main():
    parser = argparse.ArgumentParser(description="Send news newsletters to subscribers")
    parser.add_argument(
        "--test", action="store_true", help="Test mode - only send to test email"
    )
    parser.add_argument(
        "--test-email", type=str, help="Test email to use when in test mode"
    )
    parser.add_argument(
        "--country",
        type=str,
        default="us",
        help="2-letter country code for news sources",
    )
    parser.add_argument(
        "--categories",
        type=str,
        help="Comma-separated list of news categories to include",
    )
    parser.add_argument("--subject", type=str, help="Custom email subject line")
    args = parser.parse_args()

    # Check for Gmail credentials
    gmail_user = os.getenv("GMAIL_USER")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD")

    if not gmail_user or not gmail_password:
        print("Error: Gmail credentials not configured.")
        print("Please set these environment variables:")
        print("  GMAIL_USER - Your Gmail address")
        print("  GMAIL_APP_PASSWORD - Your Gmail app password")
        print("\nTo create an app password for Gmail:")
        print("1. Go to https://myaccount.google.com/apppasswords")
        print("2. Sign in with your Google account")
        print("3. Select 'App' and 'Other (Custom name)'")
        print("4. Enter 'News Newsletter' and click 'Generate'")
        sys.exit(1)

    # Get subscribers - for standalone version, we use a simple list
    subscribers = []

    # Try to load subscribers from a file if it exists
    try:
        if os.path.exists("subscribers.txt"):
            with open("subscribers.txt", "r") as f:
                for line in f:
                    if "@" in line:  # Simple validation
                        email = line.strip()
                        subscribers.append(
                            {
                                "email": email,
                                "preferences": ["technology", "business", "health"],
                            }
                        )
            print(f"Loaded {len(subscribers)} subscribers from subscribers.txt")
    except Exception as e:
        print(f"Error loading subscribers: {e}")

    # If no subscribers and not in test mode, add default subscriber (your email)
    if not subscribers and not args.test:
        subscribers.append(
            {
                "email": "hamzabouazza1711@gmail.com",
                "preferences": ["technology", "business", "health"],
            }
        )
        print("No subscribers found, using default email: hamzabouazza1711@gmail.com")

    # Initialize the newsletter manager
    newsletter = NewsletterManager(
        sender_email=gmail_user, sender_password=gmail_password
    )

    # Set up newsletter parameters
    today_date = datetime.now().strftime("%B %d, %Y")

    if args.subject:
        subject = args.subject
    else:
        subject = f"Your Daily News Digest - {today_date}"

    if args.categories:
        categories = args.categories.split(",")
    else:
        categories = ["technology", "business", "health", "science", "entertainment"]

    # If in test mode, only send to the test email
    if args.test and args.test_email:
        print(f"TEST MODE: Sending newsletter to {args.test_email} only")
        recipients = [args.test_email]
        success = newsletter.send_newsletter(
            recipients=recipients,
            subject=subject,
            categories=categories,
            country=args.country,
        )

        if success:
            print(f"Successfully sent test newsletter to {args.test_email}")
        else:
            print(f"Failed to send test newsletter to {args.test_email}")

        sys.exit(0)

    # Regular sending mode - go through each subscriber
    print(f"Preparing to send newsletter to {len(subscribers)} subscribers...")

    successful = 0
    failed = 0

    for subscriber in subscribers:
        email = subscriber["email"]
        # Use preferences if available, otherwise use default categories
        preferences = subscriber.get("preferences", categories)

        print(f"Sending to {email}...")
        success = newsletter.send_newsletter(
            recipients=[email],
            subject=subject,
            categories=preferences,
            country=args.country,
        )

        if success:
            successful += 1
        else:
            failed += 1

    print("\nNewsletter sending complete!")
    print(f"Successfully sent: {successful}")
    print(f"Failed: {failed}")


if __name__ == "__main__":
    main()
