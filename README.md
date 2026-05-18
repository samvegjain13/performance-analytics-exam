# AI-Based Employee Performance Analytics & Recommendation System

This is a full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations using OpenRouter/OpenAI compatible APIs.

## Features
- JWT Authentication & bcrypt Password Hashing
- Add, Edit, Delete, and Search Employees
- Performance Tracking
- AI-Powered Promotion & Training Recommendations
- AI-Powered Global Ranking
- Responsive Glassmorphic UI

## Technologies Used
- Frontend: React.js (Vite), React Router, Lucide Icons
- Backend: Node.js, Express.js
- Database: MongoDB
- AI: OpenRouter API (or any OpenAI-compatible API)

## Setup Instructions

### 1. Database & AI Configuration
You will need:
- A MongoDB Connection String (from MongoDB Atlas or local)
- An AI API Key (from OpenRouter or OpenAI)

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder based on `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openrouter_or_openai_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## Deployment on Render

### Backend Deployment (Render Web Service)
1. Push your code to GitHub.
2. Go to Render Dashboard -> New -> Web Service.
3. Connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Set Build Command to `npm install`.
6. Set Start Command to `npm start`.
7. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret key
   - `OPENAI_API_KEY`: Your AI API key
   - `PORT`: 5000

### Frontend Deployment (Render Static Site)
1. Go to Render Dashboard -> New -> Static Site.
2. Connect your GitHub repository.
3. Set the Root Directory to `frontend`.
4. Set Build Command to `npm run build`.
5. Set Publish Directory to `dist`.
6. Go to the Redirects/Rewrites section and add:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
   (This is required for React Router to work correctly on a static host).
   
Make sure to update `baseURL` in `frontend/src/api.js` to point to your deployed backend URL.
