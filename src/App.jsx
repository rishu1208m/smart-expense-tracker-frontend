import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login        from './pages/Login'
import Dashboard    from './pages/Dashboard'
import Expenses     from './pages/Expenses'
import Analytics    from './pages/Analytics'
import Profile      from './pages/Profile'
import SavingsGoals from './pages/SavingsGoals'
import { isLoggedIn } from './api/storage'

// If logged in, go to dashboard. If not, go to login.
function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

// If already logged in, don't show login page — go to dashboard
function PublicOnly({ children }) {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"     element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/expenses"  element={<Protected><Expenses /></Protected>} />
        <Route path="/analytics" element={<Protected><Analytics /></Protected>} />
        <Route path="/goals"     element={<Protected><SavingsGoals /></Protected>} />
        <Route path="/settings"  element={<Protected><Profile /></Protected>} />
        <Route path="*"          element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}