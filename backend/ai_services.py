import google.generativeai as genai
import httpx
import json
import base64
from typing import Dict
from config import settings
from models import GeminiResponse, OllamaResponse
from fastapi import HTTPException

genai.configure(api_key=settings.gemini_api_key)

async def analyze_with_gemini(image_bytes: bytes) -> GeminiResponse:
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = """You are an expert plant pathologist.
Analyze the uploaded cotton leaf image and identify the disease accurately.

Return STRICT JSON ONLY in this exact format:
{
  "disease_name": "",
  "category": "fungal OR bacterial OR viral OR pest OR nutrient_deficiency OR healthy",
  "confidence_score": 0-100,
  "visible_symptoms": []
}

Rules:
- Do NOT hallucinate.
- If image quality is poor, return:
  { "disease_name": "Unclear Image", "category": "healthy", "confidence_score": 0, "visible_symptoms": ["Poor image quality"] }
- Only return valid JSON, no extra text."""

        response = model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": base64.b64encode(image_bytes).decode()}
        ])

        result_text = response.text.strip()
        if result_text.startswith("```json"):
            result_text = result_text[7:-3].strip()
        elif result_text.startswith("```"):
            result_text = result_text[3:-3].strip()

        result = json.loads(result_text)

        return GeminiResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini analysis failed: {str(e)}")

async def analyze_with_ollama(gemini_data: GeminiResponse) -> OllamaResponse:
    try:
        prompt = f"""You are an agricultural expert AI.

INPUT:
- disease_name: {gemini_data.disease_name}
- category: {gemini_data.category}
- confidence_score: {gemini_data.confidence_score}
- visible_symptoms: {gemini_data.visible_symptoms}

TASK:
1. Determine severity_level (Low | Medium | High | Critical)
2. Estimate disease_intensity_percentage (0–100)
3. Suggest NATURAL/ORGANIC cures
4. Suggest CHEMICAL cures (real agricultural chemicals)
5. Provide prevention tips

Rules:
- If confidence_score < 60, mark severity_level as 'Uncertain'
- No fake chemicals
- No generic advice
- Output STRICT JSON only

OUTPUT FORMAT (return ONLY valid JSON, no extra text):
{{
  "severity_level": "",
  "intensity_percentage": 0-100,
  "natural_cure": [],
  "chemical_cure": [],
  "prevention_tips": []
}}"""

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.ollama_url}/api/generate",
                json={
                    "model": "llama3.2",
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                }
            )

            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Ollama service unavailable")

            result = response.json()
            ollama_text = result.get("response", "")

            ollama_data = json.loads(ollama_text)

            return OllamaResponse(**ollama_data)
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Ollama service not running. Please start Ollama.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama analysis failed: {str(e)}")
