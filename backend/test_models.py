import google.generativeai as genai

API_KEY = "YOUR_API_KEY"

genai.configure(api_key=API_KEY)

models = genai.list_models()

for model in models:
    print(model.name)