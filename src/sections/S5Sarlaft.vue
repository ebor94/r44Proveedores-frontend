<template>
  <div>
    <SectionCard icon="🛡️" title="SARLAFT / SAGRILAFT" subtitle="Sistema de Administración del Riesgo de Lavado de Activos y Financiación del Terrorismo.">

      <!-- Pregunta helper -->
      <div class="space-y-5">
        <RadioGroup
          label="¿Es usted o su representante legal una Persona Expuesta Políticamente (PEP)?"
          v-model="s.es_pep"
        />
        <RadioGroup
          label="¿Tiene familiares en primer grado de consanguinidad que sean PEP?"
          v-model="s.familiar_pep"
        />

        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-negro">Descripción de la actividad económica principal <span class="text-rojo text-[11px]">*</span></label>
          <textarea
            v-model="s.descripcion_actividad"
            class="input-base h-20 py-2.5 resize-y"
            placeholder="Describe en detalle la actividad económica de la empresa..."
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-negro">Origen de los fondos / recursos <span class="text-rojo text-[11px]">*</span></label>
          <textarea
            v-model="s.origen_fondos"
            class="input-base h-20 py-2.5 resize-y"
            placeholder="Describe el origen de los recursos con los que opera la empresa..."
          />
        </div>

        <RadioGroup
          label="¿La empresa maneja efectivo en sus operaciones principales?"
          v-model="s.maneja_efectivo"
        />
        <RadioGroup
          label="¿Realiza operaciones o transacciones con el exterior?"
          v-model="s.operaciones_extranjero"
        />

        <div v-if="s.operaciones_extranjero" class="flex flex-col gap-1">
          <label class="text-xs font-medium text-negro">Países con los que opera</label>
          <input v-model="s.paises_operacion" class="input-base" placeholder="Ej: USA, España, México..." />
        </div>

        <RadioGroup
          label="¿La empresa o su representante legal figura en alguna lista restrictiva nacional o internacional (ONU, OFAC, etc.)?"
          v-model="s.en_listas_restrictivas"
        />
      </div>
    </SectionCard>

    <div class="card bg-dorado-claro border-dorado/20 text-sm text-[#7d6608]">
      <strong>Declaración:</strong> Al continuar, el proveedor declara que la información suministrada es verídica y
      que la empresa y sus representantes no están vinculados a actividades de lavado de activos ni financiación
      del terrorismo.
    </div>
  </div>
</template>

<script setup>
import { useFormStore } from '@/stores/form'
import SectionCard from '@/components/form/SectionCard.vue'

const form = useFormStore()
const s = form.sarlaft

// Componente de radio interno
const RadioGroup = {
  props: { label: String, modelValue: { default: null } },
  emits: ['update:modelValue'],
  template: `
    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-negro">{{ label }} <span class="text-rojo text-[11px]">*</span></span>
      <div class="flex gap-4">
        <label class="flex items-center gap-1.5 text-sm cursor-pointer">
          <input type="radio" :checked="modelValue === true" @change="$emit('update:modelValue', true)" class="accent-verde" />
          Sí
        </label>
        <label class="flex items-center gap-1.5 text-sm cursor-pointer">
          <input type="radio" :checked="modelValue === false" @change="$emit('update:modelValue', false)" class="accent-verde" />
          No
        </label>
      </div>
    </div>
  `,
}
</script>
