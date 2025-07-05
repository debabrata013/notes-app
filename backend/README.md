# Notes App Backend with MySQL & Gemini AI

A complete backend API for a notes application with MySQL database and AI-powered note generation using Google's Gemini API.

## Features

- **User Authentication**: JWT-based registration and login
- **CRUD Operations**: Create, read, update, delete notes
- **MySQL Database**: Persistent data storage with Docker
- **AI Integration**: Generate and improve notes using Gemini AI
- **Note Types**: Support for different note formats (study, meeting, summary, etc.)
- **Statistics**: User note statistics and analytics

## Quick Setup

### 1. Start MySQL Database
```bash
# Go to database folder and start MySQL
cd ../database
./start.sh

# Or manually
cd ../database
docker-compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Update `.env` file with your Gemini API key:
```env
JWT_SECRET=op_secretkey
PORT=3500
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=notesdb
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Get your Gemini API key from: https://makersuite.google.com/app/apikey

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Project Structure
```
Inv-app/
├── backend/                 # Backend API
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
└── database/               # Database setup
    ├── docker-compose.yml
    ├── init.sql
    ├── start.sh
    ├── stop.sh
    ├── reset.sh
    └── access.sh
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Notes
- `POST /api/notes` - Create note (protected)
- `GET /api/notes` - Get all user notes (protected)
- `GET /api/notes/stats` - Get notes statistics (protected)
- `GET /api/notes/:id` - Get single note (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `DELETE /api/notes/:id` - Delete note (protected)

### AI Notes
- `POST /api/ai-notes/generate` - Generate AI note (protected)
- `PUT /api/ai-notes/improve/:id` - Improve existing note (protected)
- `PUT /api/ai-notes/title/:id` - Generate title for note (protected)
- `GET /api/ai-notes/types` - Get available note types (protected)

## Database Management

### Start Database
```bash
cd ../database
./start.sh
```

### Stop Database
```bash
cd ../database
./stop.sh
```

### Reset Database (Delete All Data)
```bash
cd ../database
./reset.sh
```

### Access MySQL Shell
```bash
cd ../database
./access.sh
```

## Usage Examples

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Generate AI Note
```bash
curl -X POST http://localhost:5000/api/ai-notes/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "prompt": "Explain React hooks with examples",
    "noteType": "study",
    "autoTitle": true
  }'
```

### 3. Create Manual Note
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my note."
  }'
```

## Troubleshooting

### Database Connection Issues
1. Ensure database is running: `cd ../database && ./start.sh`
2. Check if port 3306 is available
3. Verify environment variables in `.env`
4. Check container logs: `cd ../database && docker logs notes_mysql`

### Gemini API Issues
1. Verify API key is correct
2. Check API quota limits
3. Ensure internet connection
4. Review error logs in console
