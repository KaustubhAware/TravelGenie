import pandas as pd
import re
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
import pickle

# Load dataset
df = pd.read_csv("app/ml/travel cost.csv")

# Rename columns (fix spelling issues)
df.columns = ["City", "Type", "Cost_Range"]

# Function to clean cost
def extract_avg_cost(cost):
    try:
        # Remove unwanted characters
        cost = re.sub(r"[^\d\-]", "", str(cost))

        # Split range
        parts = cost.split("-")

        if len(parts) == 2:
            low = int(parts[0])
            high = int(parts[1])
            return (low + high) / 2
    except:
        return None

# Apply cleaning
df["Cost"] = df["Cost_Range"].apply(extract_avg_cost)

# Drop invalid rows
df = df.dropna()

# Encode city
le_city = LabelEncoder()
df["City"] = le_city.fit_transform(df["City"])

# Features & target
X = df[["City"]]
y = df["Cost"]

# Train model
model = LinearRegression()
model.fit(X, y)

# Save model
pickle.dump(model, open("app/ml/cost_model.pkl", "wb"))
pickle.dump(le_city, open("app/ml/le_city.pkl", "wb"))

print("✅ Cost model trained successfully!")