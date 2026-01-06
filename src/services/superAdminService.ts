import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + '/superadmin';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllAdmins = async () => {
    const response = await api.get(`/admins`);
    return response.data;
}

export const getAllCleaners = async () => {
  const response = await api.get('/cleaners');
  return response.data;
}