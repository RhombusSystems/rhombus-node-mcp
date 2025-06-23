#!/bin/bash

set -euo pipefail

# --- CONFIGURATION ---
NPM_PACKAGE_NAME="rhombus-node-mcp"
DOCKER_IMAGE_NAME="rhombussystems/mcp-server-rhombus"
VERSION=$(node -p "require('./package.json').version")

# --- STEP 1: Build the TypeScript Project ---
echo "📦 Building MCP server..."
npm install
npm run build

# # --- STEP 2: Publish to npm ---
echo "🚀 Publishing $NPM_PACKAGE_NAME@$VERSION to npm..."
npm publish --access public

# --- STEP 3: Build Docker Image ---
echo "🐳 Building Docker image..."
docker build -t $DOCKER_IMAGE_NAME:latest -t $DOCKER_IMAGE_NAME:$VERSION .

# --- STEP 4: Push Docker Images ---
echo "🚀 Pushing Docker image to Docker Hub..."
docker push $DOCKER_IMAGE_NAME:latest
docker push $DOCKER_IMAGE_NAME:$VERSION

echo "✅ Publish complete: npm@$VERSION and docker@$VERSION"

