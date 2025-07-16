import requests
import os

# Set your Google Maps API key here or use an environment variable
API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "AIzaSyDW3Zaqpxal5nrmJjc8oPFqHwbdE_lP9eg")
PLACE_ID = "ChIJ_4mWq3ELZ0gRqk5644bi5R0"  # Replace with your pub's Google Place ID


def fetch_google_reviews():
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={PLACE_ID}&fields=reviews&key={API_KEY}"
    response = requests.get(url)
    data = response.json()
    reviews = data.get("result", {}).get("reviews", [])
    # Only keep reviews with text and rating >= 4
    filtered = [
        {
            "author_name": r["author_name"],
            "text": r["text"],
            "rating": r["rating"],
            "profile_photo_url": r.get("profile_photo_url", ""),
            "time": r["time"]
        }
        for r in reviews if r.get("text") and r.get("rating", 0) >= 4
    ]
    return filtered

if __name__ == "__main__":
    import json
    reviews = fetch_google_reviews()
    with open("src/components/google_reviews.json", "w", encoding="utf-8") as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)
    print(f"Fetched {len(reviews)} reviews.")
