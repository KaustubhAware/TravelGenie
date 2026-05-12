import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load dataset
data = pd.read_csv("app/ml/cleaned_data.csv")

# Create feature column
data["features"] = data["type"] + " " + data["region"]

# Vectorize
cv = CountVectorizer()
vectors = cv.fit_transform(data["features"])

# Similarity matrix
similarity = cosine_similarity(vectors)


def recommend(query):
    query = query.lower()

    # 🔹 STEP 1: Exact match
    index = data[data["place"].str.lower() == query].index

    if len(index) > 0:
        index = index[0]

        distances = list(enumerate(similarity[index]))
        distances = sorted(distances, key=lambda x: x[1], reverse=True)

        return [data.iloc[i[0]]["place"] for i in distances[1:6]]

    # 🔹 STEP 2: Type match
    type_match = data[data["type"].str.lower().str.contains(query)]

    if not type_match.empty:
        return type_match["place"].head(5).tolist()

    # 🔹 STEP 3: Region match
    region_match = data[data["region"].str.lower().str.contains(query)]

    if not region_match.empty:
        return region_match["place"].head(5).tolist()

    # 🔥 STEP 4: SMART FALLBACKS
    if "manali" in query:
        return ["Solang Valley", "Mall Road", "Hadimba Temple", "Rohtang Pass"]

    if "goa" in query:
        return ["Baga Beach", "Anjuna Beach", "Chapora Fort", "Calangute Beach"]

    if "kokan" in query:
        return ["Alibaug", "Ganpatipule", "Tarkarli", "Murud-Janjira"]

    # 🔥 FINAL FALLBACK
    return [
        "Local Attraction",
        "Famous Market",
        "Scenic View Point",
        "Popular Restaurant",
        "City Center"
    ]