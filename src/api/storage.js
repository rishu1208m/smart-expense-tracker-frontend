// Save after login
export const saveAuth = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user',  JSON.stringify(user))
  localStorage.setItem('isLoggedIn', 'true')
}

// Read token anywhere
export const getToken = () => localStorage.getItem('token')

// Read user info
export const getUser = () => {
  const u = localStorage.getItem('user')
  return u ? JSON.parse(u) : null
}

// Clear on logout
export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
}

// Check if logged in
export const isLoggedIn = () => !!localStorage.getItem('isLoggedIn')