# Database Setup for Notes App

This folder contains the MySQL database setup for the Notes application.

## Quick Commands

### Start Database
```bash
./start.sh
# or
docker-compose up -d
```

### Stop Database
```bash
./stop.sh
# or
docker-compose down
```

### Reset Database (Delete All Data)
```bash
./reset.sh
# or
docker-compose down -v && docker-compose up -d
```

### Access MySQL Shell
```bash
./access.sh
# or
docker exec -it notes_mysql mysql -u root -p
# Password: root
```

## Database Details

- **Container Name**: notes_mysql
- **Host**: localhost
- **Port**: 3306
- **Database**: notesdb
- **Username**: root
- **Password**: root

## Tables Created

### users
- id (Primary Key)
- username
- email (Unique)
- password (Hashed)
- created_at
- updated_at

### notes
- id (Primary Key)
- user_id (Foreign Key)
- title
- content
- is_ai_generated
- note_type
- original_prompt
- improvement_type
- created_at
- updated_at
- last_improved
- title_generated

## Useful Commands

```bash
# Check container status
docker ps

# View logs
docker logs notes_mysql

# Check database size
docker exec notes_mysql mysql -u root -proot -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema = 'notesdb';"

# Backup database
docker exec notes_mysql mysqldump -u root -proot notesdb > backup.sql

# Restore database
docker exec -i notes_mysql mysql -u root -proot notesdb < backup.sql
```
