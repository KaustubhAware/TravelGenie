# =====================================================
# SMART TRAVEL SENTIMENT ANALYSIS
# File: app/ml/sentiment.py
# =====================================================

# =====================================================
# SENTIMENT FUNCTION
# =====================================================

def analyze_sentiment(text):

    # =====================================================
    # HANDLE LIST INPUT
    # =====================================================

    if isinstance(text, list):

        text = " ".join(text)

    # =====================================================
    # HANDLE EMPTY INPUT
    # =====================================================

    if not text:

        return "Neutral"

    # =====================================================
    # LOWERCASE TEXT
    # =====================================================

    text = text.lower()

    # =====================================================
    # POSITIVE TRAVEL KEYWORDS
    # =====================================================

    positive_keywords = [

        "beach",

        "beaches",

        "nightlife",

        "food",

        "luxury",

        "travel",

        "trip",

        "vacation",

        "holiday",

        "shopping",

        "family",

        "solo",

        "fun",

        "explore"
    ]

    # =====================================================
    # RELAXED KEYWORDS
    # =====================================================

    relaxed_keywords = [

        "peace",

        "nature",

        "spa",

        "meditation",

        "calm",

        "relax"
    ]

    # =====================================================
    # ADVENTURE KEYWORDS
    # =====================================================

    adventure_keywords = [

        "adventure",

        "trekking",

        "hiking",

        "camping",

        "rafting",

        "bike",

        "roadtrip",

        "mountain"
    ]

    # =====================================================
    # CHECK POSITIVE
    # =====================================================

    if any(word in text for word in positive_keywords):

        return "Positive"

    # =====================================================
    # CHECK RELAXED
    # =====================================================

    if any(word in text for word in relaxed_keywords):

        return "Relaxed"

    # =====================================================
    # CHECK ADVENTURE
    # =====================================================

    if any(word in text for word in adventure_keywords):

        return "Adventure"

    # =====================================================
    # DEFAULT
    # =====================================================

    return "Neutral"