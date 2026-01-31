from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class GeminiResponse(BaseModel):
    disease_name: str
    category: str
    confidence_score: float
    visible_symptoms: List[str]

class OllamaResponse(BaseModel):
    severity_level: str
    intensity_percentage: float
    natural_cure: List[str]
    chemical_cure: List[str]
    prevention_tips: List[str]

class PredictionResponse(BaseModel):
    id: str
    disease_name: str
    category: str
    confidence_score: float
    severity_level: str
    intensity_percentage: float
    visual_symptoms: List[str]
    natural_cure: List[str]
    chemical_cure: List[str]
    prevention_tips: List[str]
    image_url: str
    created_at: datetime
