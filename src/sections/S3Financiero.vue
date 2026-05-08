<template>
  <div>
    <SectionCard icon="💰" title="Datos financieros" subtitle="Extraídos de la Declaración de Renta. Los campos con fondo verde son automáticos.">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <FormField label="Año declaración" v-model="f.anio_declaracion"
          :readonly="auto.anio_declaracion" :variant="auto.anio_declaracion ? 'auto' : 'default'">
          <template #badge><AppBadge tipo="ren">Renta</AppBadge></template>
        </FormField>
        <FormField label="Activos totales ($)" v-model="f.activos_totales" placeholder="0"
          :readonly="auto.activos_totales" :variant="auto.activos_totales ? 'auto' : 'default'">
          <template #badge><AppBadge tipo="ren">Renta</AppBadge></template>
        </FormField>
        <FormField label="Pasivos totales ($)" v-model="f.pasivos_totales" placeholder="0"
          :readonly="auto.pasivos_totales" :variant="auto.pasivos_totales ? 'auto' : 'default'">
          <template #badge><AppBadge tipo="ren">Renta</AppBadge></template>
        </FormField>
        <FormField label="Patrimonio ($)" v-model="f.patrimonio" placeholder="0"
          :readonly="auto.patrimonio" :variant="auto.patrimonio ? 'auto' : 'default'">
          <template #badge><AppBadge tipo="ren">Renta</AppBadge></template>
        </FormField>
        <FormField label="Ingresos operacionales ($)" v-model="f.ingresos_operacionales" placeholder="0"
          :readonly="auto.ingresos_operacionales" :variant="auto.ingresos_operacionales ? 'auto' : 'default'">
          <template #badge><AppBadge tipo="ren">Renta</AppBadge></template>
        </FormField>
        <FormField label="Utilidad neta ($)" v-model="f.utilidad_neta" placeholder="0"
          :readonly="auto.utilidad_neta" :variant="auto.utilidad_neta ? 'auto' : 'default'">
          <template #badge><AppBadge tipo="ren">Renta</AppBadge></template>
        </FormField>
      </div>
    </SectionCard>

    <div class="card bg-dorado-claro border-dorado/20 text-sm text-[#7d6608]">
      <strong>Nota:</strong> Los valores financieros son extraídos automáticamente de la Declaración de Renta.
      Si detectas algún error, contacta al equipo de compras antes de enviar.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormStore } from '@/stores/form'
import SectionCard from '@/components/form/SectionCard.vue'
import FormField from '@/components/form/FormField.vue'
import AppBadge from '@/components/shared/AppBadge.vue'

const form = useFormStore()
const f = form.financiero
const ext = computed(() => form.extraccion.datos ?? {})

const auto = computed(() => ({
  anio_declaracion:       !!ext.value.anio_gravable,
  activos_totales:        !!ext.value.total_activos,
  pasivos_totales:        !!ext.value.total_pasivos,
  patrimonio:             !!ext.value.total_patrimonio,
  ingresos_operacionales: !!ext.value.total_ingresos_brutos,
  utilidad_neta:          !!ext.value.utilidad_operacional,
}))
</script>
