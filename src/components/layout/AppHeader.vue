<template>
  <header class="bg-verde sticky top-0 z-50 border-b-[3px] border-dorado">
    <div class="px-8 flex items-center justify-between h-16">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-dorado rounded-full flex items-center justify-center font-serif text-verde text-base font-bold">
          S
        </div>
        <div>
          <div class="font-serif text-white text-[18px] leading-tight">Serfunorte</div>
          <div class="text-[11px] text-white/55 tracking-widest uppercase">Portal de Proveedores</div>
        </div>
      </div>
      <div class="flex items-center gap-3 text-white/80 text-sm">
        <span class="hidden sm:inline">{{ auth.nombre }}</span>
        <div class="w-8 h-8 bg-dorado rounded-full flex items-center justify-center text-verde text-xs font-semibold">
          {{ auth.iniciales }}
        </div>
        <button @click="handleLogout" class="text-white/60 hover:text-white text-xs ml-1 transition-colors">
          Salir
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
