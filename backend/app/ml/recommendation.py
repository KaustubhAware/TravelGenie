import pandas as pd

from sklearn.feature_extraction.text import CountVectorizer

from sklearn.metrics.pairwise import cosine_similarity

# =====================================================
# LOAD DATASET
# =====================================================

data = pd.read_csv("app/ml/cleaned_data.csv")

# =====================================================
# CREATE FEATURES
# =====================================================

data["features"] = data["type"] + " " + data["region"]

# =====================================================
# VECTORIZE
# =====================================================

cv = CountVectorizer()

vectors = cv.fit_transform(data["features"])

# =====================================================
# SIMILARITY
# =====================================================

similarity = cosine_similarity(vectors)

# =====================================================
# RECOMMEND FUNCTION
# =====================================================

def recommend(query):

    query = query.lower()

    # =====================================================
    # EXACT MATCH
    # =====================================================

    index = data[
        data["place"].str.lower() == query
    ].index

    if len(index) > 0:

        index = index[0]

        distances = list(
            enumerate(similarity[index])
        )

        distances = sorted(
            distances,
            key=lambda x: x[1],
            reverse=True
        )

        return [
            data.iloc[i[0]]["place"]
            for i in distances[1:6]
        ]

    # =====================================================
    # TYPE MATCH
    # =====================================================

    type_match = data[
        data["type"]
        .str.lower()
        .str.contains(query)
    ]

    if not type_match.empty:

        return (
            type_match["place"]
            .head(5)
            .tolist()
        )

    # =====================================================
    # REGION MATCH
    # =====================================================

    region_match = data[
        data["region"]
        .str.lower()
        .str.contains(query)
    ]

    if not region_match.empty:

        return (
            region_match["place"]
            .head(5)
            .tolist()
        )

    # =====================================================
    # SMART FALLBACKS
    # =====================================================

    if "goa" in query:

        return [
            "Baga Beach",
            "Anjuna Beach",
            "Chapora Fort",
            "Calangute Beach"
        ]

    if "manali" in query:

        return [
            "Solang Valley",
            "Mall Road",
            "Hadimba Temple",
            "Rohtang Pass"
        ]

    # =====================================================
    # FINAL FALLBACK
    # =====================================================

    return [

        "Local Attraction",

        "Scenic View Point",

        "Popular Restaurant",

        "City Center"
    ]