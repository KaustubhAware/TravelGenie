"""
Build city cost lookup from travel cost.csv.
Run: python -m app.ml.cost_model (from backend/)
"""

import json
import re
from pathlib import Path

import pandas as pd

ML_DIR = Path(__file__).resolve().parent
CSV_PATH = ML_DIR / "travel cost.csv"
OUTPUT_PATH = ML_DIR / "city_cost_lookup.json"


def extract_avg_cost(cost_range):
    try:
        cleaned = re.sub(r"[^\d\-]", "", str(cost_range))
        parts = cleaned.split("-")
        if len(parts) == 2:
            low = int(parts[0])
            high = int(parts[1])
            return (low + high) / 2
    except (ValueError, TypeError):
        pass
    return None


def build_lookup():
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {CSV_PATH}")

    df = pd.read_csv(CSV_PATH)
    df.columns = ["City", "Type", "Cost_Range"]
    df["Cost"] = df["Cost_Range"].apply(extract_avg_cost)
    df = df.dropna(subset=["Cost"])

    city_costs = {}
    for city, group in df.groupby("City"):
        key = str(city).strip().lower()
        city_costs[key] = int(round(group["Cost"].mean()))

    overall_average = (
        int(round(df["Cost"].mean())) if len(df) else 25000
    )

    payload = {
        "city_costs": city_costs,
        "overall_average": overall_average,
    }

    OUTPUT_PATH.write_text(
        json.dumps(payload, indent=2),
        encoding="utf-8",
    )

    print(f"City cost lookup saved to {OUTPUT_PATH}")
    return payload


if __name__ == "__main__":
    build_lookup()
