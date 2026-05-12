def analyze_sentiment(text):
    if not text:
        return "Neutral"

    positive_words = [
        "beach",
        "adventure",
        "fun",
        "trip",
        "travel",
        "nightlife",
        "mountain",
        "holiday",
        "vacation"
    ]

    text = text.lower()

    # check if any positive word exists
    if any(word in text for word in positive_words):
        return "Positive"

    return "Neutral"