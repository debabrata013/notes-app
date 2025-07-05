# API Testing Examples

## Setup
1. Get your Gemini API key from: https://makersuite.google.com/app/apikey
2. Replace `your_gemini_api_key_here` in `.env` file with your actual API key
3. Start the server: `npm run dev`

## Authentication First
```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## AI Notes API Examples

### 1. Generate AI Note
```bash
curl -X POST http://localhost:5000/api/ai-notes/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "prompt": "JavaScript async/await concepts",
    "noteType": "study",
    "autoTitle": true
  }'
```

### 2. Get Available Note Types
```bash
curl -X GET http://localhost:5000/api/ai-notes/types \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Improve Existing Note
```bash
curl -X PUT http://localhost:5000/api/ai-notes/improve/NOTE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "improvementType": "enhance"
  }'
```

### 4. Generate Title for Note
```bash
curl -X PUT http://localhost:5000/api/ai-notes/title/NOTE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Note Types Available:
- `general`: Well-organized general purpose notes
- `summary`: Structured summaries with key points  
- `study`: Comprehensive study materials
- `meeting`: Professional meeting notes
- `creative`: Engaging and creative format

## Improvement Types:
- `enhance`: Add more detail and better structure
- `summarize`: Condense to key points
- `expand`: Add more detailed explanations
- `restructure`: Reorganize for better flow
