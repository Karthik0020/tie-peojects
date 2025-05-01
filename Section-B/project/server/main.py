from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import uuid
from datetime import datetime

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database in production)
users = {}
profiles = {}
items = {}
user_feedback = {}

# Sample items data with taste dimensions
ITEMS_DATA = {
    "101": {
        "id": "101",
        "name": "Neapolitan Pizza",
        "description": "Traditional wood-fired pizza with San Marzano tomatoes and fresh mozzarella.",
        "image_url": "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg",
        "features": [2, 7, 3, 2, 8, 1, 7, 6, 8, 3],  # [sweet, salty, sour, bitter, umami, spicy, texture, aroma, visual, novelty]
        "tags": ["italian", "pizza"]
    },
    # Add more items here
}

# ML Model helper functions
def calculate_similarity(user_vector, item_vector):
    user_vector = np.array(user_vector).reshape(1, -1)
    item_vector = np.array(item_vector).reshape(1, -1)
    return cosine_similarity(user_vector, item_vector)[0][0]

def generate_recommendations(user_preferences):
    recommendations = []
    user_vector = [
        user_preferences.get(dim, 5) 
        for dim in ['sweet', 'salty', 'sour', 'bitter', 'umami', 'spicy', 'texture', 'aroma', 'visual', 'novelty']
    ]
    
    for item_id, item in ITEMS_DATA.items():
        similarity = calculate_similarity(user_vector, item['features'])
        match_percentage = int(similarity * 100)
        
        recommendations.append({
            "id": item['id'],
            "name": item['name'],
            "description": item['description'],
            "image_url": item['image_url'],
            "match_percentage": match_percentage,
            "tags": item['tags'],
            "reasons": generate_recommendation_reasons(user_preferences, item, similarity)
        })
    
    return sorted(recommendations, key=lambda x: x['match_percentage'], reverse=True)

def generate_recommendation_reasons(user_preferences, item, similarity):
    reasons = []
    dimensions = [
        ('sweet', 'sweetness'),
        ('salty', 'saltiness'),
        ('sour', 'sourness'),
        ('bitter', 'bitterness'),
        ('umami', 'umami'),
        ('spicy', 'spiciness'),
        ('texture', 'texture'),
        ('aroma', 'aroma'),
        ('visual', 'visual presentation'),
        ('novelty', 'novelty')
    ]
    
    # Find top matching dimensions
    matches = []
    for i, (dim_id, dim_name) in enumerate(dimensions):
        user_value = user_preferences.get(dim_id, 5)
        item_value = item['features'][i]
        difference = abs(user_value - item_value)
        matches.append({
            'dimension': dim_name,
            'match': 10 - difference,
            'user_value': user_value,
            'item_value': item_value
        })
    
    # Sort by match score and get top 3
    matches.sort(key=lambda x: x['match'], reverse=True)
    top_matches = matches[:3]
    
    for match in top_matches:
        if match['match'] >= 8:
            if match['user_value'] >= 7 and match['item_value'] >= 7:
                reasons.append(f"This item's {match['dimension']} perfectly matches your preference for high {match['dimension']}.")
            elif match['user_value'] <= 3 and match['item_value'] <= 3:
                reasons.append(f"This item's low {match['dimension']} aligns well with your preference.")
            else:
                reasons.append(f"The {match['dimension']} profile of this item is a good match for your preferences.")
    
    # Add overall match reason
    if similarity >= 0.9:
        reasons.append("This is an exceptional match for your overall taste profile.")
    elif similarity >= 0.8:
        reasons.append("This aligns very well with your general taste preferences.")
    elif similarity >= 0.7:
        reasons.append("This is a good overall match for your taste profile.")
    
    return reasons[:4]  # Limit to 4 reasons

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class User(BaseModel):
    id: str
    name: str
    email: str

class TasteProfile(BaseModel):
    user_id: str
    dimensions: dict
    insights: List[str]
    confidence: int
    data_points: int
    updated_at: str

class Feedback(BaseModel):
    user_id: str
    item_id: str
    liked: bool

# Routes
@app.post("/api/auth/register", response_model=dict)
async def register(user: UserCreate):
    if any(u['email'] == user.email for u in users.values()):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    users[user_id] = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "password": user.password  # In production, hash the password!
    }
    
    return {
        "user": {"id": user_id, "name": user.name, "email": user.email},
        "token": f"mock-token-{user_id}"
    }

@app.post("/api/auth/login")
async def login(email: str, password: str):
    user = next((u for u in users.values() if u['email'] == email), None)
    if not user or user['password'] != password:  # In production, verify hashed password
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "user": {"id": user['id'], "name": user['name'], "email": user['email']},
        "token": f"mock-token-{user['id']}"
    }

@app.post("/api/profiles/{user_id}", response_model=TasteProfile)
async def update_profile(user_id: str, preferences: dict):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate insights based on preferences
    insights = []
    high_values = [k for k, v in preferences.items() if v >= 8]
    low_values = [k for k, v in preferences.items() if v <= 2]
    
    if high_values:
        insights.append(f"You have a strong preference for {', '.join(high_values)} flavors and experiences.")
    if low_values:
        insights.append(f"You tend to avoid {', '.join(low_values)} flavors and experiences.")
    
    if preferences.get('novelty', 5) >= 7:
        insights.append("You enjoy exploring new and unfamiliar tastes.")
    elif preferences.get('novelty', 5) <= 3:
        insights.append("You prefer familiar tastes that you know you'll enjoy.")
    
    profile = {
        "user_id": user_id,
        "dimensions": preferences,
        "insights": insights,
        "confidence": 75 + np.random.randint(20),  # Random between 75-95%
        "data_points": 10 + np.random.randint(40),  # Random between 10-50
        "updated_at": datetime.now().isoformat()
    }
    
    profiles[user_id] = profile
    return profile

@app.get("/api/recommendations/{user_id}")
async def get_recommendations(user_id: str):
    if user_id not in profiles:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile = profiles[user_id]
    return generate_recommendations(profile['dimensions'])

@app.post("/api/feedback")
async def provide_feedback(feedback: Feedback):
    if feedback.user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    
    if feedback.user_id not in user_feedback:
        user_feedback[feedback.user_id] = []
    
    user_feedback[feedback.user_id].append({
        "item_id": feedback.item_id,
        "liked": feedback.liked,
        "timestamp": datetime.now().isoformat()
    })
    
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)