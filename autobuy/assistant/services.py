"""assistant/services.py — skeleton helpers for AI assistant
All heavy‑lifting (OCR, external API calls, ML models) will be implemented here.
Each function returns mock data so the endpoint works end‑to‑end during early development.
"""
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import random

# ─────────────────────────── Helpers ──────────────────────────────

def extract_plate_from_photos(photo_urls: List[str]) -> Optional[str]:
    """OCR номерного знака на фото. Returns plate number like 'AA1234BB' or None."""
    # TODO: integrate with AWS Rekognition / OpenALPR
    if not photo_urls:
        return None
    # Mock: 10% chance to detect a plate
    return "AA1234BB" if random.random() < 0.1 else None


def fetch_gai_vehicle_data(plate: str) -> Dict:
    """Query external Ministry of Internal Affairs API by plate.
    Should return dict with make, model, year, color, engine if found.
    """
    # TODO: HTTP request → official API, handle auth & errors
    return {
        "brand": "Toyota",
        "model": "Corolla",
        "year": 2015,
        "color": "white",
        "engine": "1.6 VVT‑i"
    }


def fetch_spec_sheet(brand: str, model: str, year: int, engine: str) -> Dict:
    """Get 200‑row spec sheet from internal catalogue (returns SEO-desc & tech sheet)."""
    # TODO: query internal microservice / DB table
    tech_sheet = {
        "length_mm": 4620,
        "width_mm": 1775,
        "height_mm": 1460,
        "boot_l": 470,
        # ... up to 200 params
    }
    seo_desc = f"{brand} {model} {year} з мотором {engine} та багажником {tech_sheet['boot_l']} л."
    return {"technical_sheet": tech_sheet, "seo_description": seo_desc}


def estimate_price(brand: str, model: str, year: int, mileage: int, engine: str) -> int:
    """Very naive price estimation. TODO: ML model."""
    base = 10000 + (datetime.now().year - year) * -150
    mileage_penalty = (mileage or 0) * 0.02
    return max(500, int(base - mileage_penalty))


def build_suggestions(draft: Dict, spec_sheet: Dict) -> (List[Dict], float, List[str]):
    suggestions = []
    missing = [k for k in ("mileage", "color") if not draft.get(k)]
    if missing:
        suggestions.append({"field": ",".join(missing), "message": "Заповніть обов'язкові поля"})
    if draft.get("description_user", "") and len(draft["description_user"]) < 50:
        suggestions.append({"field": "description_user", "message": "Опис занадто короткий (<50 символів)"})
    score = max(0.4, 1 - len(suggestions) * 0.1)
    return suggestions, round(score, 2), missing


def generate_description(draft: Dict) -> str:
    """Generate short SEO description if user leaves blank."""
    base = f"{draft.get('brand','')} {draft.get('model','')} {draft.get('year','')} з двигуном {draft.get('engine','')}"
    return f"{base} — чудовий варіант для щоденних поїздок та подорожей Україною.".strip()


def generate_listing_suggestions(draft: Dict) -> Dict:
    """Entry point used by views.py"""
    plate = extract_plate_from_photos(draft.get("photos", []))
    if plate:
        draft.update(fetch_gai_vehicle_data(plate))

    spec_sheet = {}
    if all(draft.get(k) for k in ("brand", "model", "year", "engine")):
        spec_sheet = fetch_spec_sheet(draft["brand"], draft["model"], draft["year"], draft["engine"])

    suggested_price = estimate_price(
        brand=draft.get("brand"), model=draft.get("model"), year=draft.get("year"),
        mileage=draft.get("mileage", 0), engine=draft.get("engine")
    )

    suggestions, score, missing = build_suggestions(draft, spec_sheet)

    return {
        "plate_number": plate,
        "vin_data": draft.get("vin") or None,
        "missing_fields": missing,
        "suggested_price": suggested_price,
        "quality_score": score,
        "description": spec_sheet.get("seo_description") if spec_sheet else generate_description(draft),
        "spec_sheet": spec_sheet.get("technical_sheet") if spec_sheet else None,
        "suggestions": suggestions,
    }
