#!/bin/bash

# Cron script to send daily newsletters
# Add to crontab with:
# 0 8 * * * /path/to/cron_newsletter.sh > /path/to/newsletter_log.txt 2>&1

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Set email credentials
export GMAIL_USER="hamzabouazza1711@gmail.com"
export GMAIL_APP_PASSWORD="iniyowebgelyrswb"  # Your Gmail app password

# Get current date for the log
echo "========================================"
echo "Running newsletter script on $(date)"
echo "========================================"

# Run the newsletter script (using the standalone version)
python3 send_newsletter_standalone.py

# Log completion
echo "Newsletter script completed at $(date)"
echo "========================================" 