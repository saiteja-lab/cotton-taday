# Quick Setup Guide

## 1. Get API Keys

### Supabase
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > API
4. Copy your project URL and anon public key

### Gemini API
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key

## 2. Database Setup

The database schema is already created. You need to:

1. Go to Supabase Dashboard > Storage
2. Create a new bucket named "predictions"
3. Make it public
4. Set MIME type restrictions to images only

## 3. Backend Configuration

1. Navigate to `backend/` directory
2. Copy `.env.example` to `.env`
3. Fill in the values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_api_key
OLLAMA_URL=http://localhost:11434
JWT_SECRET=generate_a_random_32_character_string
```

Generate JWT secret:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Install and setup Ollama:
```bash
# Download from https://ollama.ai
# After installation:
ollama pull llama3.2
ollama serve
```

6. Run backend:
```bash
uvicorn main:app --reload --port 8000
```

## 4. Frontend Configuration

The frontend is pre-configured to connect to `http://localhost:8000`.

If you need to change the API URL, edit `src/lib/api.ts`:
```typescript
const API_URL = 'http://localhost:8000';
```

## 5. Run the Application

Terminal 1 (Ollama):
```bash
ollama serve
```

Terminal 2 (Backend):
```bash
cd backend
uvicorn main:app --reload --port 8000
```

Terminal 3 (Frontend):
```bash
npm run dev
```

## 6. Test the Application

1. Open http://localhost:5173
2. Sign up with email and password
3. Upload a cotton leaf image
4. View the analysis results

## Troubleshooting

### Port Already in Use
If port 8000 is busy, change backend port:
```bash
uvicorn main:app --reload --port 8001
```
Then update `API_URL` in `src/lib/api.ts`

### CORS Errors
Backend has CORS enabled for all origins. If you still face issues:
- Check backend is running
- Verify API_URL in frontend matches backend URL
- Clear browser cache

### Ollama Not Running
```bash
# Check if Ollama is running
curl http://localhost:11434/api/version

# If not, start it
ollama serve
```

### Image Upload Fails
- Verify storage bucket "predictions" exists in Supabase
- Check bucket is public
- Verify Supabase credentials are correct
