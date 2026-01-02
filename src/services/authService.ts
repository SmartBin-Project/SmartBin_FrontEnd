import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
})

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    const { access_token, user } = response.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    return response.data
  } catch (err) {
    throw err
  }
}

export const register = async (
  username: string,
  email: string,
  password: string,
  role: string,
  area?: string,
) => {
  try {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      role,
      area,
    })
    return response.data
  } catch (err) {
    throw err
  }
}

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  } catch (err) {
    throw err
  }
}

export const verifyOtp = async (email: string, otp: string, password: string) => {
  try {
    const response = await api.post('/auth/reset-password', {
      email,
      otp,
      password,
    })
    return response.data
  } catch (err) {
    throw err
  }
}

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout')
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    return response.data
  } catch (err) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    throw err
  }
}

export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token')
}

export const getUserProfile = async () => {
  try {
    const response = await api.get(`/superadmin/profile`)
    return response.data
  } catch (err) {
    // If endpoint doesn't exist, return current user from storage
    const user = getCurrentUser()
    if (user) return user
    throw err
  }
}

export const updateUserProfile = async (profileData: any) => {
  try {
    const response = await api.patch(`/superadmin/profile`, profileData)
    return response.data
  } catch (err) {
    throw err
  }
}
