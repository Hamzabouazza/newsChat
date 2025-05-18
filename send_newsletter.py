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

    # Get subscribers
    subscribers = []
    try:
        # If we're running this from the API directory, try to import subscribers
        import main

        subscribers = main.subscribers
        print(f"Loaded {len(subscribers)} subscribers from the API")
    except ImportError:
        # If we can't import, we might be running standalone
        print("Could not import subscribers from API. Using sample subscriber.")
        if args.test and args.test_email:
            subscribers = [
                {
                    "email": args.test_email,
                    "preferences": ["technology", "business", "health"],
                }
            ]
        else:
            print("Error: No subscribers found and no test email provided.")
            sys.exit(1)

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
