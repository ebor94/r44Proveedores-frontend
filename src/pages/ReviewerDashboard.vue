<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="max-w-[1100px] mx-auto w-full px-6 py-8">
      <h1 class="sec-title">Dashboard de revisión</h1>
      <p class="sec-sub">Lista de proveedores registrados para revisión y aprobación.</p>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-3 mb-6">
        <input
          v-model="busqueda"
          class="input-base max-w-xs"
          placeholder="Buscar por nombre o NIT..."
        />
        <select v-model="filtroEstado" class="input-base w-40">
          <option value="">Todos</option>
          <option value="extraccion_completada">Pendiente revisión</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
        <button class="btn-primary" @click="cargar">🔄 Actualizar</button>
      </div>

      <!-- Tabla -->
      <div class="bg-white border border-gris-borde rounded-lg overflow-hidden">
        <div v-if="cargando" class="flex justify-center py-12">
          <AppSpinner size="lg" color="#1a4a2e" />
        </div>
        <div v-else-if="!proveedores.length" class="text-center py-12 text-gris-texto">
          No hay proveedores registrados aún.
        </div>
        <table v-else class="w-full text-sm">
          <thead class="bg-gris-fondo border-b border-gris-borde">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gris-texto">Radicado</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gris-texto">Nombre / Razón social</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gris-texto">NIT</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gris-texto">Estado</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gris-texto">Fecha</th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gris-borde">
            <tr v-for="p in proveedoresFiltrados" :key="p.id" class="hover:bg-gris-fondo/50 transition-colors">
              <td class="px-4 py-3 font-mono text-xs text-verde font-semibold">{{ p.radicado }}</td>
              <td class="px-4 py-3 font-medium">{{ p.razon_social || p.nombre_completo }}</td>
              <td class="px-4 py-3 text-gris-texto">{{ p.nit }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold" :class="estadoClass(p.estado)">
                  {{ estadoLabel(p.estado) }}
                </span>
              </td>
              <td class="px-4 py-3 text-gris-texto text-xs">{{ formatFecha(p.created_at) }}</td>
              <td class="px-4 py-3">
                <button class="text-verde text-xs hover:underline">Ver detalle →</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSpinner from '@/components/shared/AppSpinner.vue'
import { obtenerProveedores } from '@/services/proveedor'

const proveedores = ref([])
const cargando = ref(false)
const busqueda = ref('')
const filtroEstado = ref('')

const proveedoresFiltrados = computed(() => {
  return proveedores.value.filter(p => {
    const nombre = (p.razon_social || p.nombre_completo || '').toLowerCase()
    const nit = (p.nit || '').toLowerCase()
    const q = busqueda.value.toLowerCase()
    const matchBusqueda = !q || nombre.includes(q) || nit.includes(q)
    const matchEstado = !filtroEstado.value || p.estado === filtroEstado.value
    return matchBusqueda && matchEstado
  })
})

async function cargar() {
  cargando.value = true
  try {
    const res = await obtenerProveedores()
    proveedores.value = res.data ?? []
  } catch {
    proveedores.value = []
  } finally {
    cargando.value = false
  }
}

function estadoClass(estado) {
  const map = {
    aprobado: 'bg-verde-claro text-verde',
    rechazado: 'bg-red-50 text-rojo',
    extraccion_completada: 'bg-azul-claro text-azul',
    documentos_cargados: 'bg-[#fdf6e8] text-dorado',
  }
  return map[estado] ?? 'bg-gris-fondo text-gris-texto'
}

function estadoLabel(estado) {
  const map = {
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    extraccion_completada: 'Pendiente revisión',
    documentos_cargados: 'Procesando documentos',
    borrador: 'Borrador',
  }
  return map[estado] ?? estado
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(cargar)
</script>
