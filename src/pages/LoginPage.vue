<template>
  <div class="min-h-screen bg-gris-fondo flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-verde rounded-full flex items-center justify-center font-serif text-white text-3xl mx-auto mb-3">
          S
        </div>
        <h1 class="font-serif text-2xl text-verde">Serfunorte</h1>
        <p class="text-sm text-gris-texto mt-1">Portal de Proveedores · R-44</p>
      </div>

      <!-- Card -->
      <div class="card">
        <h2 class="font-serif text-xl text-verde mb-1">Iniciar sesión</h2>
        <p class="text-sm text-gris-texto mb-5">Ingresa tus credenciales para continuar</p>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-negro">Correo electrónico</label>
            <input
              v-model="email"
              type="email"
              placeholder="proveedor@empresa.com"
              class="input-base"
              autocomplete="email"
              required
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-negro">Contraseña</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="input-base"
              autocomplete="current-password"
              required
            />
          </div>

          <div v-if="error" class="text-sm text-rojo bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary flex items-center justify-center gap-2" :disabled="loading">
            <AppSpinner v-if="loading" size="sm" color="#fff" />
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

      </div>

      <p class="text-center text-xs text-gris-texto mt-4">
        Serfunorte / Los Olivos · Cúcuta, Colombia
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { login } from '@/services/auth'
import AppSpinner from '@/components/shared/AppSpinner.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const res = await login(email.value, password.value)
    auth.login(res.data)
    router.push(auth.rol === 'proveedor' ? '/form' : '/dashboard')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
