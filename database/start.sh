#!/bin/bash

echo "🚀 Starting MySQL Database..."
docker-compose up -d

echo "⏳ Waiting for MySQL to be ready..."
sleep 10

echo "✅ Checking MySQL status..."
docker ps | grep notes_mysql

echo "📊 MySQL logs:"
docker logs notes_mysql --tail 10

echo "🎉 Database is ready!"
echo "📝 Connection Details:"
echo "   Host: localhost"
echo "   Port: 3306"
echo "   Database: notesdb"
echo "   Username: root"
echo "   Password: root"
