import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Load dataset
df = pd.read_csv("app/ml/reviews.csv")

# Create labels manually
df["sentiment"] = [1, 0, 1, 0, 1, 0]  # 1=positive, 0=negative

# Convert text to vectors
cv = CountVectorizer()
X = cv.fit_transform(df["review"])
y = df["sentiment"]

# Train model
model = MultinomialNB()
model.fit(X, y)

# Prediction function
def analyze_sentiment(text):
    text_vec = cv.transform([text])
    prediction = model.predict(text_vec)[0]

    return "Positive" if prediction == 1 else "Negative"