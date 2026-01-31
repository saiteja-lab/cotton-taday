# Cotton Leaf Disease Prediction Backend

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Install and run Ollama:
```bash
# Install Ollama from https://ollama.ai
ollama pull llama3.2
```

4. Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- POST /auth/signup - Register new user
- POST /auth/login - Login user
- POST /predict - Upload image for disease prediction (JWT required)
- GET /predictions - Get user's prediction history (JWT required)

## Storage Bucket

Create a public storage bucket named "predictions" in Supabase dashboard.
