import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('r44_token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('r44_usuario') || 'null'))

  const rol = computed(() => usuario.value?.rol ?? null)
  const nombre = computed(() => usuario.value?.nombre ?? '')
  const iniciales = computed(() => {
    const n = nombre.value.trim()
    if (!n) return 'U'
    const parts = n.split(' ')
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : n.slice(0, 2).toUpperCase()
  })

  function login(data) {
    token.value = data.token
    usuario.value = data.usuario
    localStorage.setItem('r44_token', data.token)
    localStorage.setItem('r44_usuario', JSON.stringify(data.usuario))
  }

  function logout() {
    token.value = null
    usuario.value = null
    localStorage.removeItem('r44_token')
    localStorage.removeItem('r44_usuario')
  }

  return { token, usuario, rol, nombre, iniciales, login, logout }
})
