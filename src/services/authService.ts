import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    const { access_token, user } = response.data
    sessionStorage.setItem('access_token', access_token)
    sessionStorage.setItem('user', JSON.stringify(user))
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
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')
    return response.data
  } catch (err) {
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')
    throw err
  }
}

export const getCurrentUser = () => {
  const user = sessionStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const getAccessToken = () => {
  return sessionStorage.getItem('access_token')
}

export const isAuthenticated = (): boolean => {
  return !!sessionStorage.getItem('access_token')
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
