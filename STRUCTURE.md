# Project Structure

```
cotton-leaf-disease-prediction/
│
├── backend/                          # Python FastAPI Backend
│   ├── main.py                       # Main FastAPI application
│   ├── config.py                     # Configuration and settings
│   ├── models.py                     # Pydantic data models
│   ├── auth.py                       # Authentication utilities
│   ├── ai_services.py                # Gemini & Ollama integration
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Git ignore rules
│   ├── README.md                     # Backend documentation
│   └── run.sh                        # Quick start script
│
├── src/                              # React Frontend
│   ├── components/
│   │   ├── Login.tsx                 # Login page component
│   │   ├── Signup.tsx                # Signup page component
│   │   └── Dashboard.tsx             # Main dashboard with upload
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx           # Authentication state management
│   │
│   ├── lib/
│   │   └── api.ts                    # API client for backend
│   │
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # React entry point
│   ├── index.css                     # Tailwind CSS imports
│   └── vite-env.d.ts                 # Vite type definitions
│
├── public/                           # Static assets
├── dist/                             # Production build output
│
├── README.md                         # Main project documentation
├── SETUP_GUIDE.md                    # Quick setup instructions
├── STRUCTURE.md                      # This file
│
├── package.json                      # Node dependencies
├── vite.config.ts                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── index.html                        # HTML entry point
```

## Key Files Explained

### Backend

- **main.py**: Contains all API endpoints (signup, login, predict)
- **ai_services.py**: Integrates Gemini for image analysis and Ollama for agricultural intelligence
- **auth.py**: Handles password hashing, JWT creation, and token verification
- **config.py**: Loads environment variables using Pydantic settings
- **models.py**: Defines request/response data structures

### Frontend

- **Dashboard.tsx**: Main UI with image upload and results display
- **AuthContext.tsx**: Manages authentication state across the app
- **api.ts**: Centralized API client for all backend calls
- **App.tsx**: Root component with routing logic

## Data Flow

1. User uploads image in Dashboard
2. Frontend sends image to `/predict` endpoint
3. Backend calls Gemini API for disease detection
4. Backend calls Ollama for severity analysis
5. Backend stores prediction in Supabase
6. Backend returns merged results to frontend
7. Frontend displays comprehensive analysis

## Database Tables

### users
- id (uuid)
- email (text)
- password_hash (text)
- created_at (timestamptz)

### predictions
- id (uuid)
- user_id (uuid)
- image_url (text)
- disease_name (text)
- category (text)
- confidence_score (numeric)
- severity_level (text)
- intensity_percentage (numeric)
- visual_symptoms (jsonb)
- natural_cure (jsonb)
- chemical_cure (jsonb)
- prevention_tips (jsonb)
- created_at (timestamptz)

## Storage

Supabase Storage bucket "predictions" stores uploaded leaf images.
