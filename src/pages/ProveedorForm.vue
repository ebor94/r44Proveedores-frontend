<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <AppStepper :pasoActual="form.pasoActual" :pasosCompletos="pasosCompletos" @goto="irAPaso" />

    <main class="max-w-[920px] mx-auto w-full px-6 py-8 flex-1">
      <!-- Título de sección -->
      <div class="mb-2">
        <h1 class="sec-title">{{ seccionActual.titulo }}</h1>
        <p class="sec-sub">{{ seccionActual.subtitulo }}</p>
      </div>

      <!-- Secciones -->
      <S1Documentos v-if="form.pasoActual === 1" @completado="marcarCompleto(1)" />
      <S2DatosBasicos v-else-if="form.pasoActual === 2" />
      <S3Financiero v-else-if="form.pasoActual === 3" />
      <S4Referencias v-else-if="form.pasoActual === 4" />
      <S5Sarlaft v-else-if="form.pasoActual === 5" />
      <S6RevisionFirma v-else-if="form.pasoActual === 6" @enviado="onEnviado" />

      <!-- Pantalla de éxito -->
      <PantallaExito v-if="radicado" :radicado="radicado" />

      <!-- Navegación -->
      <div v-if="!radicado" class="flex justify-between mt-6">
        <button
          v-if="form.pasoActual > 1"
          class="btn-secondary"
          @click="form.pasoActual--"
        >
          ← Anterior
        </button>
        <span v-else />
        <button
          v-if="form.pasoActual < 6"
          class="btn-primary"
          :disabled="!pasosCompletos.includes(form.pasoActual)"
          @click="avanzar"
        >
          Siguiente →
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFormStore } from '@/stores/form'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppStepper from '@/components/layout/AppStepper.vue'
import S1Documentos from '@/sections/S1Documentos.vue'
import S2DatosBasicos from '@/sections/S2DatosBasicos.vue'
import S3Financiero from '@/sections/S3Financiero.vue'
import S4Referencias from '@/sections/S4Referencias.vue'
import S5Sarlaft from '@/sections/S5Sarlaft.vue'
import S6RevisionFirma from '@/sections/S6RevisionFirma.vue'
import PantallaExito from '@/components/shared/PantallaExito.vue'

const form = useFormStore()
const pasosCompletos = ref([])
const radicado = ref(null)

const secciones = [
  { titulo: 'Documentos', subtitulo: 'Sube los cuatro documentos requeridos para iniciar la extracción automática.' },
  { titulo: 'Datos básicos', subtitulo: 'Verifica la información extraída y completa los campos manuales.' },
  { titulo: 'Información financiera', subtitulo: 'Datos financieros extraídos de la Declaración de Renta.' },
  { titulo: 'Referencias', subtitulo: 'Registra hasta 2 referencias bancarias y 2 comerciales.' },
  { titulo: 'SARLAFT / SAGRILAFT', subtitulo: 'Cuestionario de cumplimiento de prevención de lavado de activos.' },
  { titulo: 'Revisión y firma', subtitulo: 'Revisa el formulario completo, firma digitalmente y envía.' },
]

const seccionActual = computed(() => secciones[form.pasoActual - 1])

function marcarCompleto(paso) {
  if (!pasosCompletos.value.includes(paso)) {
    pasosCompletos.value.push(paso)
  }
}

function avanzar() {
  if (form.pasoActual < 6) {
    marcarCompleto(form.pasoActual)
    form.pasoActual++
  }
}

function irAPaso(paso) {
  if (paso <= form.pasoActual || pasosCompletos.value.includes(paso - 1)) {
    form.pasoActual = paso
  }
}

function onEnviado(rad) {
  radicado.value = rad
}
</script>
