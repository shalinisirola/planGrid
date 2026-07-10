# 🏗️ PlanGrid - AI Material Forecasting System

> **Advanced Material Demand Forecasting & Supply Chain Management for Power Grid Projects**

![Status](https://img.shields.io/badge/Status-Active-success)
![Stack](https://img.shields.io/badge/Stack-MERN_%2B_Flask-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

## 📖 Overview

**PlanGrid** is a full-stack web application designed to optimize material planning for large-scale infrastructure projects. It leverages **Machine Learning (XGBoost)** to predict material requirements (like Steel Towers, Conductors, Insulators) based on project parameters, reducing inventory waste and procurement delays.

Beyond forecasting, it offers a complete suite for **Supply Chain Management**, including inventory tracking, supplier management, and automated purchase approvals.

---

## ✨ Key Features

### 🧠 AI-Powered Forecasting
*   **Demand Prediction**: Predicts quantity of 5+ key materials using historical data.
*   **XGBoost Model**: Trained on realistic power grid datasets for high accuracy.
*   **Confidence Scoring**: Provides confidence intervals for every prediction.

### 📊 Interactive Dashboard
*   **Live Analytics**: Real-time project status and material consumption trends.
*   **Visualizations**: Interactive charts for forecast vs. actual comparisons.
*   **Map View**: Geospatial visualization of active project sites.

### ⛓️ Supply Chain & Operations
*   **Inventory Management**: Track stock levels across multiple warehouses.
*   **Procurement**: Automated purchase request and order approval workflows.
*   **Supplier Portal**: Manage vendor ratings and order history.
*   **Team Collaboration**: Role-based access and team management.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, responsive UI with customized Tailwind CSS. |
| **Backend** | Python (Flask) | Robust API handling business logic and ML inference. |
| **Database** | MongoDB | Flexible NoSQL schema for complex project data. |
| **ML Engine** | Scikit-Learn / XGBoost | Predictive modeling and data processing. |
| **Auth** | JWT (JSON Web Tokens) | Secure, stateless authentication. |

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/kruhi7533/plangrid.git
cd plangrid
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\Activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 📂 Project Structure

```bash
plangrid/
├── backend/                 # Flask API & ML Logic
│   ├── app.py              # Application Entry Point
│   ├── email_service.py    # Notification System
│   └── models/             # Database Schemas
├── frontend/                # React Client
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Feature Pages (Dashboard, Inventory...)
│   │   └── contexts/       # Global State (Auth, Theme)
├── *.joblib                 # Pre-trained ML Models
└── README.md                # Documentation
```


---
*© 2025 PlanGrid Team. All Rights Reserved.*
