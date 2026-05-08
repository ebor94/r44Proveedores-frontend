<template>
  <div>
    <!-- Resumen -->
    <SectionCard icon="📋" title="Resumen del formulario R-44">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div class="text-xs text-gris-texto mb-0.5">Tipo de persona</div>
          <div class="font-medium capitalize">{{ form.tipoPersona === 'juridica' ? 'Persona Jurídica' : 'Persona Natural' }}</div>
        </div>
        <div v-if="form.tipoPersona === 'juridica'">
          <div class="text-xs text-gris-texto mb-0.5">Razón social</div>
          <div class="font-medium">{{ form.datosBasicosJuridica.razon_social || '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gris-texto mb-0.5">NIT / Cédula</div>
          <div class="font-medium">{{ form.tipoPersona === 'juridica' ? form.datosBasicosJuridica.nit : form.datosBasicosNatural.cedula_numero || '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gris-texto mb-0.5">Ciudad</div>
          <div class="font-medium">{{ form.datosBasicosJuridica.ciudad || form.datosBasicosNatural.ciudad || '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gris-texto mb-0.5">Representante legal</div>
          <div class="font-medium">{{ form.representanteLegal.nombre || '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gris-texto mb-0.5">Referencias bancarias</div>
          <div class="font-medium">{{ form.referenciasBancarias.length }}</div>
        </div>
        <div>
          <div class="text-xs text-gris-texto mb-0.5">Accionistas registrados</div>
          <div class="font-medium">{{ form.accionistas.length }}</div>
        </div>
        <div>
          <div class="text-xs text-gris-texto mb-0.5">PEP</div>
          <div class="font-medium">{{ form.sarlaft.es_pep === true ? 'Sí' : form.sarlaft.es_pep === false ? 'No' : '—' }}</div>
        </div>
      </div>
    </SectionCard>

    <!-- Firma -->
    <SectionCard icon="✍️" title="Firma digital" subtitle="Dibuja tu firma o sube una imagen de la misma.">
      <FirmaCanvas v-model="form.firma.base64" />
      <div v-if="!form.firma.base64" class="text-xs text-rojo mt-2">
        La firma es obligatoria para enviar el formulario.
      </div>
    </SectionCard>

    <!-- Declaración -->
    <SectionCard icon="📜" title="Declaración y autorización">
      <div class="text-sm text-gris-texto leading-relaxed mb-4">
        Declaro bajo la gravedad del juramento que la información consignada en este formulario es veraz,
        completa y actualizada. Autorizo a Serfunorte – Los Olivos para verificar y tratar mis datos personales
        de conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013.
      </div>
      <label class="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" v-model="form.firma.aceptacion_terminos" class="mt-0.5 accent-verde" />
        <span class="text-sm">
          He leído y acepto los términos de tratamiento de datos personales y confirmo que la información es correcta.
          <span class="text-rojo text-xs">*</span>
        </span>
      </label>
    </SectionCard>

    <!-- Botón enviar -->
    <div class="flex justify-end">
      <button
        class="btn-primary px-8 py-3 text-base"
        :disabled="!puedeEnviar || enviando"
        @click="enviar"
      >
        <span v-if="enviando" class="flex items-center gap-2">
          <AppSpinner size="sm" color="#fff" /> Enviando...
        </span>
        <span v-else>Enviar formulario →</span>
      </button>
    </div>

    <div v-if="errorEnvio" class="mt-3 text-sm text-rojo text-right">{{ errorEnvio }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFormStore } from '@/stores/form'
import { crearProveedor, actualizarProveedor } from '@/services/proveedor'
import SectionCard from '@/components/form/SectionCard.vue'
import FirmaCanvas from '@/components/firma/FirmaCanvas.vue'
import AppSpinner from '@/components/shared/AppSpinner.vue'

const emit = defineEmits(['enviado'])
const form = useFormStore()

const enviando = ref(false)
const errorEnvio = ref('')

const puedeEnviar = computed(() =>
  form.firma.base64 && form.firma.aceptacion_terminos
)

async function enviar() {
  enviando.value = true
  errorEnvio.value = ''
  try {
    const payload = {
      tipo_persona: form.tipoPersona,
      datos_basicos: form.tipoPersona === 'juridica' ? form.datosBasicosJuridica : form.datosBasicosNatural,
      representante_legal: form.representanteLegal,
      accionistas: form.accionistas,
      financiero: form.financiero,
      referencias_bancarias: form.referenciasBancarias,
      referencias_comerciales: form.referenciasComerciales,
      sarlaft: form.sarlaft,
      firma: { base64: form.firma.base64, aceptacion_terminos: form.firma.aceptacion_terminos },
    }

    let res
    if (form.proveedorId) {
      res = await actualizarProveedor(form.proveedorId, payload)
    } else {
      res = await crearProveedor(payload)
    }

    const radicado = res.data?.radicado
      ?? `SFN-${new Date().getFullYear()}-${String(res.data?.id ?? 0).padStart(6, '0')}`
    form.radicado = radicado
    emit('enviado', radicado)
  } catch (err) {
    errorEnvio.value = err.message
  } finally {
    enviando.value = false
  }
}
</script>
