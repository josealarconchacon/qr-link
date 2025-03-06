#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Building the Angular app..."
npm run build

echo "Setting up routing fallback..."
cp dist/qr-link/index.html dist/qr-link/404.html

echo "Build completed!" 