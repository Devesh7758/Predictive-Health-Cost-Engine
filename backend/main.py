import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pickle
import pandas as pd
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'health_cost_model.pkl')
columns_path = os.path.join(BASE_DIR, 'model_columns.pkl')

with open(model_path, 'rb') as file:
    model = pickle.load(file)

with open(columns_path, 'rb') as file:
    model_columns = pickle.load(file)

class IndiaMedicalInput(BaseModel):
    age: int = Field(..., ge=1, le=120)
    sex: str
    bmi: float = Field(..., ge=10.0, le=60.0)
    children: int = Field(..., ge=0, le=20)
    smoker: str
    state: str
    district: str

@app.post("/predict")
def predict_charges(data: IndiaMedicalInput):
    input_data = {col: 0 for col in model_columns}
    
    input_data['age'] = data.age
    input_data['bmi'] = data.bmi
    input_data['children'] = data.children
    
    input_data['sex'] = 1 if data.sex.lower() == 'male' else 0
    input_data['smoker'] = 1 if data.smoker.lower() == 'yes' else 0
    
    if data.bmi >= 30 and data.smoker.lower() == 'yes':
        input_data['obese_smoker'] = 1
        
    regional_weight = 0
    if data.state.lower() == 'delhi':
        if data.district.lower() in ['south delhi', 'new delhi']:
            regional_weight = 0.15
        elif data.district.lower() in ['north delhi', 'west delhi']:
            regional_weight = 0.05
            
    input_data['region_southeast'] = 1
    
    input_df = pd.DataFrame([input_data])[model_columns]
    
    usd_base_prediction = model.predict(input_df)[0]
    
    inr_multiplier = 83.50
    adjusted_usd = usd_base_prediction * (1 + regional_weight)
    inr_prediction = adjusted_usd * inr_multiplier
    
    localized_premium = (inr_prediction * 0.25) + 5000
    
    return {"predicted_charges_inr": round(float(localized_premium), 2)}