from fastapi import APIRouter
from app.ml.predict_cost import predict_cost

router = APIRouter()

@router.get("/predict-cost")
def get_cost(city: str):
    cost = predict_cost(city)
    return {"predicted_cost": cost}