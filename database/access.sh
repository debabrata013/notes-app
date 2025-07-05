#!/bin/bash

echo "🔗 Accessing MySQL Database..."
echo "📝 Use password: root"
docker exec -it notes_mysql mysql -u root -p
