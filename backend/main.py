from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from config import settings
from models import UserSignup, UserLogin, Token, PredictionResponse
from auth import hash_password, verify_password, create_access_token, verify_token
from ai_services import analyze_with_gemini, analyze_with_ollama
import uuid
from datetime import datetime

app = FastAPI(title="Cotton Leaf Disease Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = create_client(settings.supabase_url, settings.supabase_key)

@app.post("/auth/signup", response_model=Token)
async def signup(user: UserSignup):
    existing = supabase.table("users").select("id").eq("email", user.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    password_hash = hash_password(user.password)

    supabase.table("users").insert({
        "id": user_id,
        "email": user.email,
        "password_hash": password_hash
    }).execute()

    access_token = create_access_token({"sub": user_id})
    return Token(access_token=access_token, token_type="bearer")

@app.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    result = supabase.table("users").select("*").eq("email", user.email).maybeSingle().execute()

    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, result.data["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": result.data["id"]})
    return Token(access_token=access_token, token_type="bearer")

@app.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(...),
    user_id: str = Depends(verify_token)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    gemini_result = await analyze_with_gemini(image_bytes)

    ollama_result = await analyze_with_ollama(gemini_result)

    image_filename = f"{uuid.uuid4()}.jpg"
    storage_response = supabase.storage.from_("predictions").upload(
        image_filename,
        image_bytes,
        {"content-type": file.content_type}
    )

    image_url = supabase.storage.from_("predictions").get_public_url(image_filename)

    prediction_id = str(uuid.uuid4())
    prediction_data = {
        "id": prediction_id,
        "user_id": user_id,
        "image_url": image_url,
        "disease_name": gemini_result.disease_name,
        "category": gemini_result.category,
        "confidence_score": gemini_result.confidence_score,
        "severity_level": ollama_result.severity_level,
        "intensity_percentage": ollama_result.intensity_percentage,
        "visual_symptoms": gemini_result.visible_symptoms,
        "natural_cure": ollama_result.natural_cure,
        "chemical_cure": ollama_result.chemical_cure,
        "prevention_tips": ollama_result.prevention_tips
    }

    supabase.table("predictions").insert(prediction_data).execute()

    return PredictionResponse(
        **prediction_data,
        created_at=datetime.utcnow()
    )

@app.get("/predictions")
async def get_predictions(user_id: str = Depends(verify_token)):
    result = supabase.table("predictions").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data

@app.get("/")
async def root():
    return {"message": "Cotton Leaf Disease Prediction API"}
