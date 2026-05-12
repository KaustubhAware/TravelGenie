import pandas as pd

# Load dataset
df = pd.read_csv("app/ml/world_famous_places_2024.csv")

# Select useful columns
df = df[[
    "Place_Name",
    "Country",
    "City",
    "Type",
    "Entry_Fee_USD",
    "Best_Visit_Month",
    "Region"
]]

# Rename columns (simple names)
df.columns = [
    "place",
    "country",
    "city",
    "type",
    "cost",
    "best_month",
    "region"
]

# Remove missing values
df = df.dropna()

# Convert cost to numeric (important)
df["cost"] = pd.to_numeric(df["cost"], errors="coerce")

# Drop invalid rows
df = df.dropna()

# Save cleaned dataset
df.to_csv("app/ml/cleaned_data.csv", index=False)

print("✅ Cleaned dataset created successfully!")