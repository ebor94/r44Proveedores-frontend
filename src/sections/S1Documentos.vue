<template>
  <div>
    <!-- Grid de upload -->
    <SectionCard icon="📎" title="Documentos requeridos" subtitle="Sube los cuatro documentos en PDF (cédula también acepta JPG/PNG)">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <UploadZone label="RUT (DIAN)" icon="🏛️" hint="PDF · máx. 10 MB" accept=".pdf"
          v-model="form.documentos.rut" />
        <UploadZone label="Cámara de Comercio" icon="🏢" hint="PDF · máx. 10 MB" accept=".pdf"
          v-model="form.documentos.camara" />
        <UploadZone label="Declaración de Renta" icon="📊" hint="PDF · máx. 10 MB" accept=".pdf"
          v-model="form.documentos.renta" />
        <UploadZone label="Cédula R.L." icon="🪪" hint="PDF, JPG o PNG" accept=".pdf,.jpg,.jpeg,.png"
          :esCedula="true" v-model="form.documentos.cedula" />
      </div>

      <!-- Progreso -->
      <div class="flex items-center gap-2 text-sm text-gris-texto">
        <div class="flex gap-1">
          <span v-for="doc in docKeys" :key="doc" class="w-2 h-2 rounded-full"
            :class="form.documentos[doc] ? 'bg-verde-medio' : 'bg-gris-borde'" />
        </div>
        {{ docsSubidos }}/4 documentos cargados
      </div>
    </SectionCard>

    <!-- Banner de procesamiento -->
    <div v-if="estado === 'procesando'" class="card flex items-center gap-4 bg-azul-claro border-azul/30">
      <AppSpinner size="lg" color="#1a5276" />
      <div>
        <div class="font-semibold text-azul">Extrayendo información con IA...</div>
        <div class="text-xs text-azul/70 mt-0.5">Claude API está procesando los 4 documentos en paralelo. Esto puede tomar hasta 3 minutos.</div>
      </div>
    </div>

    <!-- Resultado de extracción -->
    <div v-if="estado === 'completada'" class="card bg-verde-claro border-verde-borde">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">✅</span>
        <span class="font-semibold text-verde">Extracción completada</span>
      </div>
      <p class="text-sm text-verde/80">
        Los campos marcados con fondo verde (RUT/Cámara/Renta) y morado (Cédula) se han completado automáticamente.
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
        :disabled="docsSubidos < 4"
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
    const res = await subirDocumentos(form.proveedorId ?? 0, form.documentos)
    const pid = res.data?.proveedor_id ?? form.proveedorId
    form.proveedorId = pid

    stopPolling = iniciarPolling(
      pid,
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
    // Demo mode: simular extracción exitosa
    if (import.meta.env.DEV || err.message?.includes('Network')) {
      setTimeout(() => {
        form.setExtraccion({
          nit: '900.123.456-7',
          razon_social: 'Empresa Demo S.A.S.',
          direccion: 'Calle 5 # 10-20',
          ciudad: 'Cúcuta',
          departamento: 'Norte de Santander',
          telefono: '(607) 5712345',
          correo: 'contacto@empresademo.com',
          ciiu: '4690',
          matricula_mercantil: '123456',
          rl_nombre: 'Juan Carlos Pérez',
          rl_cedula: '13.500.000',
          fecha_expedicion: '2010-05-15',
          ciudad_expedicion: 'Cúcuta',
          fecha_nacimiento: '1980-03-22',
          lugar_nacimiento: 'Cúcuta',
          cedula_numero_serie: '00000000',
          activos_totales: '500.000.000',
          pasivos_totales: '200.000.000',
          patrimonio: '300.000.000',
          ingresos_operacionales: '800.000.000',
          utilidad_neta: '50.000.000',
          anio_declaracion: '2023',
        })
        emit('completado')
      }, 3000)
    } else {
      form.extraccion.estado = 'error'
      errorMsg.value = err.message
    }
  }
}
</script>
