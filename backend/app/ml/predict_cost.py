import pickle

# Load model + encoder
model = pickle.load(open("app/ml/cost_model.pkl", "rb"))
le_city = pickle.load(open("app/ml/le_city.pkl", "rb"))

def predict_cost(city):
    city = city.strip()

    # 🔥 SAFETY FIX (IMPORTANT)
    if city not in le_city.classes_:
        return 3000  # default fallback cost

    city_encoded = le_city.transform([city])[0]

    # Predict cost
    predicted_cost = model.predict([[city_encoded]])[0]

    return round(predicted_cost, 2)