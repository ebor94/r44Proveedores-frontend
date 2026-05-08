import api from './api'

export async function login(email, password) {
  return api.post('/r44/auth/login', { email, password })
}

export async function logout() {
  return api.post('/r44/auth/logout').catch(() => {})
}
