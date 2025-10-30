#!/bin/bash

# Script to copy conf/local.py to local.backup and remove secrets

set -e

SOURCE_FILE="conf/local.py"
BACKUP_FILE="local.backup"

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "Error: $SOURCE_FILE not found"
    exit 1
fi

# Copy the file
echo "Copying $SOURCE_FILE to $BACKUP_FILE..."
cp "$SOURCE_FILE" "$BACKUP_FILE"

# Remove secrets using sed
echo "Removing secrets from $BACKUP_FILE..."

# Replace AAPAYOUT_JANICE_API_KEY value
sed -i 's/\(AAPAYOUT_JANICE_API_KEY = \).*/\1"REDACTED"  # Secret removed/' "$BACKUP_FILE"

# Replace DISCORD_APP_SECRET value
sed -i 's/\(DISCORD_APP_SECRET = \).*/\1"REDACTED"/' "$BACKUP_FILE"

# Replace DISCORD_BOT_TOKEN value
sed -i 's/\(DISCORD_BOT_TOKEN = \).*/\1"REDACTED"/' "$BACKUP_FILE"

echo "Done! Sanitized config saved to $BACKUP_FILE"
echo "The following secrets were redacted:"
echo "  - AAPAYOUT_JANICE_API_KEY"
echo "  - DISCORD_APP_SECRET"
echo "  - DISCORD_BOT_TOKEN"
