<template>
  <div>
    <!-- Grid de upload -->
    <SectionCard icon="📎" title="Documentos" subtitle="RUT y Cédula son obligatorios. Cámara de Comercio y Declaración de Renta son opcionales (si aplica).">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <UploadZone label="RUT (DIAN)" icon="🏛️" hint="PDF · máx. 10 MB · Requerido" accept=".pdf"
          v-model="form.documentos.rut" />
        <UploadZone label="Cámara de Comercio" icon="🏢" hint="PDF · máx. 10 MB · Opcional" accept=".pdf"
          v-model="form.documentos.camara" />
        <UploadZone label="Declaración de Renta" icon="📊" hint="PDF · máx. 10 MB · Opcional" accept=".pdf"
          v-model="form.documentos.renta" />
        <UploadZone label="Cédula R.L." icon="🪪" hint="PDF, JPG o PNG · Requerido" accept=".pdf,.jpg,.jpeg,.png"
          :esCedula="true" v-model="form.documentos.cedula" />
      </div>

      <!-- Progreso -->
      <div class="flex items-center gap-2 text-sm text-gris-texto">
        <div class="flex gap-1">
          <span v-for="doc in docKeys" :key="doc" class="w-2 h-2 rounded-full"
            :class="form.documentos[doc] ? 'bg-verde-medio' : 'bg-gris-borde'" />
        </div>
        {{ docsSubidos }}/4 documentos cargados
        <span class="text-gris-texto/60">(mín. RUT + Cédula)</span>
      </div>
    </SectionCard>

    <!-- Banner de procesamiento -->
    <div v-if="estado === 'procesando'" class="card flex items-center gap-4 bg-azul-claro border-azul/30">
      <AppSpinner size="lg" color="#1a5276" />
      <div>
        <div class="font-semibold text-azul">Extrayendo información con IA...</div>
        <div class="text-xs text-azul/70 mt-0.5">Claude API está procesando los documentos en paralelo. Esto puede tomar hasta 3 minutos.</div>
      </div>
    </div>

    <!-- Resultado de extracción -->
    <div v-if="estado === 'completada'" class="card bg-verde-claro border-verde-borde">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">✅</span>
        <span class="font-semibold text-verde">Extracción completada</span>
      </div>
      <p class="text-sm text-verde/80">
        Los campos marcados con fondo verde (RUT/Cámara/Renta) y morado (Cédula) se han completado automáticamente con los documentos subidos.
        Puedes continuar al paso siguiente.
      </p>
    </div>

    <!-- Error -->
    <div v-if="estado === 'error'" class="card bg-red-50 border-red-200">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xl">❌</span>
        <span class="font-semibold text-rojo">Error en la extracción</span>
      </div>
      <p class="text-sm text-rojo/80">{{ errorMsg }}</p>
      <button class="btn-primary mt-3 text-xs" @click="procesarDocumentos">Reintentar</button>
    </div>

    <!-- Botón procesar -->
    <div v-if="estado === 'pendiente'" class="flex justify-end mt-2">
      <button
        class="btn-primary"
        :disabled="!form.documentos.rut || !form.documentos.cedula"
        @click="procesarDocumentos"
      >
        Procesar documentos →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFormStore } from '@/stores/form'
import { subirDocumentos, iniciarPolling } from '@/services/documentos'
import { crearBorrador } from '@/services/proveedor'
import SectionCard from '@/components/form/SectionCard.vue'
import UploadZone from '@/components/upload/UploadZone.vue'
import AppSpinner from '@/components/shared/AppSpinner.vue'

const emit = defineEmits(['completado'])
const form = useFormStore()

const docKeys = ['rut', 'camara', 'renta', 'cedula']
const docsSubidos = computed(() => docKeys.filter(k => form.documentos[k]).length)
const estado = computed(() => form.extraccion.estado)
const errorMsg = ref('')

let stopPolling = null

async function procesarDocumentos() {
  form.extraccion.estado = 'procesando'
  errorMsg.value = ''
  try {
    // Crear borrador si aún no existe un proveedor
    if (!form.proveedorId) {
      const borradorRes = await crearBorrador(form.tipoPersona)
      form.proveedorId = borradorRes.data?.id
    }

    await subirDocumentos(form.proveedorId, form.documentos)

    stopPolling = iniciarPolling(
      form.proveedorId,
      (datos) => {
        form.setExtraccion(datos)
        emit('completado')
      },
      (err) => {
        form.extraccion.estado = 'error'
        errorMsg.value = err.message
      }
    )
  } catch (err) {
    form.extraccion.estado = 'error'
    errorMsg.value = err.message
  }
}
</script>
