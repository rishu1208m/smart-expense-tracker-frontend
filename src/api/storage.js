// ─────────────────────────────────────────
//  LocalStorage helpers for JWT auth
// ─────────────────────────────────────────

// Save token + user after login/register
export const saveAuth = (token, user) => {
  localStorage.setItem('token',      token)
  localStorage.setItem('user',       JSON.stringify(user))
  localStorage.setItem('isLoggedIn', 'true')
}

// Get JWT token
export const getToken = () => localStorage.getItem('token')

// Get user object
export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// Check if logged in
export const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true'

// Clear everything on logout
export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
}