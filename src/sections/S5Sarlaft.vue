<template>
  <div>
    <SectionCard icon="🛡️" title="Gestión antilavado — SARLAFT"
      subtitle="Sección VI del R-44. Responda bajo la gravedad de juramento.">
      <div class="space-y-5">

        <RadioGroup
          label="¿Dispone de medios para prevenir el lavado de activos?"
          v-model="s.tiene_sistema_control"
        />

        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium text-negro">Documentos con los que cuenta:</span>
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" v-model="s.tiene_cod_conducta" class="accent-verde" />
              Código de Conducta
            </label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" v-model="s.tiene_manual_siplaft" class="accent-verde" />
              Manual SIPLAFT
            </label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" v-model="s.tiene_manual_procedimientos" class="accent-verde" />
              Manual de Procedimientos
            </label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" v-model="s.tiene_manual_sarlaft" class="accent-verde" />
              Manual SARLAFT
            </label>
          </div>
        </div>

        <hr class="border-gris-borde" />

        <RadioGroup label="¿Maneja recursos públicos?"                             v-model="s.maneja_efectivo" />
        <RadioGroup label="¿Es Persona Políticamente Expuesta (PEP)?"              v-model="s.es_pep" />
        <RadioGroup label="¿Tiene vínculo familiar con un PEP?"                    v-model="s.familiar_pep" />

        <hr class="border-gris-borde" />

        <RadioGroup label="¿Efectúa operaciones en moneda extranjera?"             v-model="s.operaciones_extranjero" />

        <div v-if="s.operaciones_extranjero" class="flex flex-col gap-1">
          <label class="text-xs font-medium text-negro">Países / monedas con las que opera</label>
          <input v-model="s.paises_operacion" class="input-base" placeholder="Ej: USA (USD), España (EUR)..." />
        </div>

        <RadioGroup label="¿Ha sido sancionado por procesos de LA/FT?"             v-model="s.en_listas_restrictivas" />

        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-negro">
            Declaración del origen de fondos <span class="text-rojo text-[11px]">*</span>
          </label>
          <textarea
            v-model="s.origen_fondos"
            class="input-base h-20 py-2.5 resize-y"
            placeholder="Declare el origen de sus recursos (ej: ingresos por actividad comercial lícita de prestación de servicios)…"
          />
        </div>

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

const RadioGroup = {
  props: { label: String, modelValue: { default: null } },
  emits: ['update:modelValue'],
  template: `
    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-negro">{{ label }} <span class="text-rojo text-[11px]">*</span></span>
      <div class="flex gap-4">
        <label class="flex items-center gap-1.5 text-sm cursor-pointer">
          <input type="radio" :checked="modelValue === true"  @change="$emit('update:modelValue', true)"  class="accent-verde" /> Sí
        </label>
        <label class="flex items-center gap-1.5 text-sm cursor-pointer">
          <input type="radio" :checked="modelValue === false" @change="$emit('update:modelValue', false)" class="accent-verde" /> No
        </label>
      </div>
    </div>
  `,
}
</script>
