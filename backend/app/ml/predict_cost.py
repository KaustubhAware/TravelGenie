import pickle

# =====================================================
# LOAD MODEL
# =====================================================

model = pickle.load(
    open("app/ml/cost_model.pkl", "rb")
)

le_city = pickle.load(
    open("app/ml/le_city.pkl", "rb")
)

# =====================================================
# PREDICT COST
# =====================================================

def predict_cost(city):

    try:

        city_encoded = le_city.transform(
            [city]
        )[0]

        prediction = model.predict(
            [[city_encoded]]
        )[0]

        return int(prediction)

    except:

        return 25000