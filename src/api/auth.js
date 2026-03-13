// ─────────────────────────────────────────
//  API Base URL — switches local vs production
// ─────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'https://smart-expense-tracker-backend-production-a4a5.up.railway.app/api'

// ─────────────────────────────────────────
//  POST helper
// ─────────────────────────────────────────
const post = async (endpoint, body, token = null) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Something went wrong' }))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}

// ─────────────────────────────────────────
//  GET helper
// ─────────────────────────────────────────
const get = async (endpoint, token) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Request failed')
  return res.json()
}

// ─────────────────────────────────────────
//  DELETE helper
// ─────────────────────────────────────────
const del = async (endpoint, token) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Delete failed')
  return res
}

// ─────────────────────────────────────────
//  PUT helper
// ─────────────────────────────────────────
const put = async (endpoint, body, token) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Update failed')
  return res.json()
}

// ─────────────────────────────────────────
//  Auth
// ─────────────────────────────────────────
export const loginUser    = (email, password) => post('/auth/login',    { email, password })
export const registerUser = (data)            => post('/auth/register', data)

// ─────────────────────────────────────────
//  Expenses
// ─────────────────────────────────────────
export const getExpenses   = (token)          => get('/expenses',         token)
export const addExpense    = (data, token)    => post('/expenses',         data, token)
export const updateExpense = (id, data, token)=> put(`/expenses/${id}`,   data, token)
export const deleteExpense = (id, token)      => del(`/expenses/${id}`,   token)

// ─────────────────────────────────────────
//  Budget
// ─────────────────────────────────────────
export const getBudget = (token)       => get('/budget',  token)
export const setBudget = (data, token) => post('/budget', data, token)

// ─────────────────────────────────────────
//  Dashboard & Analytics
// ─────────────────────────────────────────
export const getDashboard = (token) => get('/dashboard', token)
export const getAnalytics = (token) => get('/analytics', token)