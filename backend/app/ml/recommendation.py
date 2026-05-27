from pathlib import Path

import pandas as pd

try:
    from sklearn.feature_extraction.text import CountVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    CountVectorizer = None
    cosine_similarity = None

# =====================================================
# LOAD DATASET
# =====================================================

DATASET_PATH = Path(__file__).resolve().with_name("cleaned_data.csv")
FALLBACK_PLACES = [
    {
        "place": "Rajmachi Fort",
        "type": "fort trek",
        "region": "Lonavala Maharashtra",
    },
    {
        "place": "Kalsubai Peak",
        "type": "peak trek",
        "region": "Igatpuri Maharashtra",
    },
    {
        "place": "Pawna Lake",
        "type": "camping lake",
        "region": "Pune Maharashtra",
    },
    {
        "place": "Alibaug Beach",
        "type": "beach camping",
        "region": "Konkan Maharashtra",
    },
    {
        "place": "Sinhagad Fort",
        "type": "fort trek",
        "region": "Pune Maharashtra",
    },
]

if DATASET_PATH.exists():
    data = pd.read_csv(DATASET_PATH)
else:
    data = pd.DataFrame(FALLBACK_PLACES)

# =====================================================
# CREATE FEATURES
# =====================================================

data["features"] = data["type"].fillna("") + " " + data["region"].fillna("")

# =====================================================
# VECTORIZE
# =====================================================

cv = CountVectorizer() if CountVectorizer else None

vectors = cv.fit_transform(data["features"]) if cv else None

# =====================================================
# SIMILARITY
# =====================================================

similarity = cosine_similarity(vectors) if cosine_similarity and vectors is not None else None

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

    if len(index) > 0 and similarity is not None:

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
