import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Expenses   from './pages/Expenses'
import Analytics  from './pages/Analytics'
import Profile    from './pages/Profile'
import { isLoggedIn } from './api/storage'

// Protected route wrapper
function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/expenses"  element={<Protected><Expenses /></Protected>} />
        <Route path="/analytics" element={<Protected><Analytics /></Protected>} />
        <Route path="/settings"  element={<Protected><Profile /></Protected>} />
        <Route path="*"          element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}