const BASE_URL = 'http://smart-expense-tracker-backend-production-a4a5.up.railway.app' // Change to your backend URL

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors({
  origin: "https://smart-expense-tracker-frontend-dun.vercel.app",
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Login failed')
  return res.json() // Returns { token, user }
}

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Registration failed')
  return res.json()
}