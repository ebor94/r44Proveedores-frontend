<template>
  <div>
    <!-- Referencias bancarias -->
    <SectionCard icon="🏦" title="Referencias bancarias" subtitle="Mínimo 1, máximo 2 referencias.">
      <div class="space-y-4 mb-3">
        <div v-for="(ref, i) in form.referenciasBancarias" :key="i" class="border border-gris-borde rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-verde">Referencia bancaria {{ i + 1 }}</span>
            <button v-if="form.referenciasBancarias.length > 1" class="text-xs text-rojo hover:underline" @click="form.eliminarRefBancaria(i)">
              Eliminar
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <FormField label="Entidad bancaria" v-model="ref.entidad" required />
            <FormField label="Tipo de cuenta" type="select" v-model="ref.tipo_cuenta" :options="tiposCuenta" required />
            <FormField label="Número de cuenta" v-model="ref.numero_cuenta" required />
            <FormField label="Ciudad" v-model="ref.ciudad" required />
          </div>
        </div>
      </div>
      <button
        v-if="form.referenciasBancarias.length < 2"
        class="btn-secondary text-sm"
        @click="form.agregarRefBancaria"
      >
        + Agregar referencia bancaria
      </button>
    </SectionCard>

    <!-- Referencias comerciales -->
    <SectionCard icon="🤝" title="Referencias comerciales" subtitle="Mínimo 1, máximo 2 referencias.">
      <div class="space-y-4 mb-3">
        <div v-for="(ref, i) in form.referenciasComerciales" :key="i" class="border border-gris-borde rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-verde">Referencia comercial {{ i + 1 }}</span>
            <button v-if="form.referenciasComerciales.length > 1" class="text-xs text-rojo hover:underline" @click="form.eliminarRefComercial(i)">
              Eliminar
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <FormField label="Empresa" v-model="ref.empresa" required />
            <FormField label="Persona de contacto" v-model="ref.contacto" required />
            <FormField label="Teléfono" v-model="ref.telefono" required />
            <FormField label="Actividad económica" v-model="ref.actividad" required />
          </div>
        </div>
      </div>
      <button
        v-if="form.referenciasComerciales.length < 2"
        class="btn-secondary text-sm"
        @click="form.agregarRefComercial"
      >
        + Agregar referencia comercial
      </button>
    </SectionCard>
  </div>
</template>

<script setup>
import { useFormStore } from '@/stores/form'
import SectionCard from '@/components/form/SectionCard.vue'
import FormField from '@/components/form/FormField.vue'

const form = useFormStore()
const tiposCuenta = ['Corriente', 'Ahorros', 'CDT']
</script>
