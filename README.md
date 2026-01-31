# Cotton Leaf Disease Prediction System

A complete AI-powered system for detecting and analyzing cotton leaf diseases using image analysis.

## System Architecture

- **Frontend**: React + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: Supabase PostgreSQL
- **AI Services**:
  - Gemini API (Google) - Image-based disease detection
  - Ollama (Local LLM) - Severity analysis and recommendations
- **Authentication**: JWT-based email/password

## Features

- Upload cotton leaf images
- AI-powered disease detection
- Detailed analysis including:
  - Disease name and category
  - Confidence score
  - Severity level and intensity percentage
  - Visual symptoms
  - Natural (organic) cures
  - Chemical treatment options
  - Prevention tips
- Prediction history storage
- Secure user authentication

## Setup Instructions

### Prerequisites

1. Node.js 18+ and npm
2. Python 3.9+
3. Ollama installed locally
4. Supabase account
5. Google Gemini API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure `.env` with your credentials:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
OLLAMA_URL=http://localhost:11434
JWT_SECRET=your_random_secret_key_min_32_characters
```

5. Install and run Ollama:
```bash
# Install Ollama from https://ollama.ai
ollama pull llama3.2
ollama serve
```

6. Create Supabase storage bucket:
- Go to Supabase Dashboard > Storage
- Create a public bucket named "predictions"

7. Run the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

## Usage

1. Create an account or login
2. Upload a cotton leaf image
3. Click "Analyze Leaf" to get predictions
4. View detailed analysis results including:
   - Disease identification
   - Severity assessment
   - Treatment recommendations
   - Prevention strategies

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Predictions
- `POST /predict` - Upload image and get disease prediction (requires JWT)
- `GET /predictions` - Get user's prediction history (requires JWT)

## AI Workflow

### Step 1: Image Detection (Gemini)
Gemini API analyzes the uploaded cotton leaf image and identifies:
- Disease name
- Category (fungal, bacterial, viral, pest, nutrient deficiency, or healthy)
- Confidence score
- Visible symptoms

### Step 2: Agricultural Intelligence (Ollama)
Ollama processes Gemini's output to determine:
- Severity level (Low, Medium, High, Critical)
- Disease intensity percentage
- Natural/organic cure options
- Chemical treatment recommendations
- Prevention tips

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Row Level Security (RLS) on database
- Secure storage for uploaded images
- Protected API endpoints

## Tech Stack Details

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Vite (build tool)

### Backend
- FastAPI
- Python-JOSE (JWT)
- Passlib (password hashing)
- Google Generative AI SDK
- Supabase Python client
- HTTPX (async HTTP client)

## Production Deployment

1. Build frontend:
```bash
npm run build
```

2. Deploy backend to a cloud service (AWS, GCP, etc.)
3. Configure environment variables in production
4. Ensure Ollama is running in production environment
5. Set up proper CORS policies
6. Use HTTPS for all endpoints

## Troubleshooting

### Ollama Connection Error
- Ensure Ollama is installed and running: `ollama serve`
- Verify Ollama URL in backend `.env`
- Check if llama3.2 model is pulled: `ollama pull llama3.2`

### Gemini API Error
- Verify API key is correct in `.env`
- Check API quota in Google Cloud Console
- Ensure billing is enabled for Gemini API

### Image Upload Error
- Verify storage bucket "predictions" exists in Supabase
- Check bucket is set to public
- Verify Supabase credentials in `.env`

### Authentication Issues
- Clear browser localStorage
- Verify JWT_SECRET is properly set
- Check token expiration settings
