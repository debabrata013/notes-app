#!/bin/bash

echo "🔄 Resetting MySQL Database (This will delete all data)..."
read -p "Are you sure? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗑️  Stopping and removing containers with volumes..."
    docker-compose down -v
    
    echo "🚀 Starting fresh database..."
    docker-compose up -d
    
    echo "⏳ Waiting for MySQL to initialize..."
    sleep 15
    
    echo "✅ Database reset complete!"
else
    echo "❌ Reset cancelled."
fi
