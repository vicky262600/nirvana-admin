#!/bin/bash

# Script to configure CORS for Firebase Storage
# Make sure you have gsutil installed and configured

echo "Setting up CORS for Firebase Storage bucket..."

# Your Firebase Storage bucket name
BUCKET_NAME="rira-social-media.appspot.com"

# Apply CORS configuration
gsutil cors set cors.json gs://$BUCKET_NAME

echo "CORS configuration applied to bucket: $BUCKET_NAME"
echo "You can verify the configuration with: gsutil cors get gs://$BUCKET_NAME"
