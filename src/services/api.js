import axios from 'axios'

const api = axios.create({
  baseURL: 'https://mantix-api.losolivoscucuta.com:8444/api',
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('r44_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error ?? err.message ?? 'Error de conexión'
    return Promise.reject(new Error(msg))
  }
)

export default api
