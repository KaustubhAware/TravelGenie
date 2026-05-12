from fastapi import APIRouter
from app.ml.recommendation import recommend

router = APIRouter()

@router.get("/recommend")
def get_recommendation(place: str):

    result = recommend(place)

    # fallback fix
    if result == ["No places found"]:
        result = ["Popular Beach", "City Center", "Famous Market"]

    return {"recommendations": result}