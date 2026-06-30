# Predictive Health Cost Engine (India)

A production-grade, end-to-end full-stack data science application that predicts annual health insurance premiums. The system transitions a US-based dataset into a localized Indian economic context, integrating regional risk weightings for Indian states and specific Delhi districts like Dwarka, North Delhi, and South Delhi.

## Architectural Overview

The application architecture decouples the machine learning research pipelines from the customer-facing deployment layers:

1. **Research & Analysis Layer (`/research`):** Jupyter research notebook detailing deep Exploratory Data Analysis (EDA), distribution normalization using log-transformations, feature engineering interaction terms, and evaluation metrics across multiple linear and ensemble models.
2. **Backend API Service (`/backend`):** A high-performance FastAPI service that secures input payloads using structured Pydantic boundaries and serves serialized scikit-learn artifacts via predictive API endpoints.
3. **Frontend Application (`/frontend`):** A responsive, single-page React client interface built on Vite, managing dynamic multi-tier sub-region dropdown arrays and client-side validation thresholds.

## Model Performance & Evaluation Matrix

During the research phase, multiple regression algorithms were evaluated using Train/Test splits to analyze performance:

| Regression Model | MAE | RMSE | R² Score |
| :--- | :--- | :--- | :--- |
| Linear Regression | ₹3,699.00 | ₹7,639.23 | 0.6241 |
| Ridge Regression | ₹3,674.21 | ₹7,573.46 | 0.6305 |
| Lasso Regression | ₹3,449.31 | ₹6,893.27 | 0.6939 |
| **Random Forest (Ensemble)** | **₹2,561.10** | **₹4,648.55** | **0.8608** |

### Key Technical Engineering Insights:
* **The Non-Linear Breakdown:** Standard linear models systematically failed to handle complex anomalies, leading to severe underestimations for high-cost outliers. This limitation was diagnosed mathematically using Residual Plot Analysis.
* **Feature Engineering:** Introducing a custom interaction flag (`obese_smoker`) to isolate intersectional medical risks allowed the **Random Forest Regressor** to optimize tree splits, pushing overall explanation capability ($R^2$) past **86%**.

## Core Tech Stack

* **Data Science:** Python, Pandas, Numpy, Scikit-learn, Seaborn, Matplotlib
* **Backend:** FastAPI, Uvicorn, Pydantic (Data Validation), Pickle (Serialization)
* **Frontend:** React.js, Vite, JavaScript (ES6+), HTML5/CSS3

## Local Execution Guide

### 1. Run the Backend API
Navigate to the backend directory, install requirements, and boot the server:
```bash
cd backend
pip install fastapi uvicorn pandas scikit-learn
python -m uvicorn main:app --reload

### 2. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

http://localhost:5173