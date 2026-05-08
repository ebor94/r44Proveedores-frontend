<template>
  <nav class="bg-white border-b border-gris-borde px-8 flex overflow-x-auto">
    <template v-for="(step, i) in steps" :key="step.id">
      <button
        class="flex items-center gap-2 px-4 py-3.5 text-xs font-medium whitespace-nowrap border-b-[3px] transition-all"
        :class="stepClass(step.id)"
        @click="emit('goto', step.id)"
        :disabled="step.id > pasoActual && !estaCompleto(step.id - 1)"
      >
        <span
          class="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
          :class="numClass(step.id)"
        >
          <template v-if="estaCompleto(step.id)">✓</template>
          <template v-else>{{ step.id }}</template>
        </span>
        {{ step.label }}
      </button>
      <span v-if="i < steps.length - 1" class="text-gris-borde text-lg self-center px-0.5">›</span>
    </template>
  </nav>
</template>

<script setup>
const props = defineProps({
  pasoActual: { type: Number, required: true },
  pasosCompletos: { type: Array, default: () => [] },
})
const emit = defineEmits(['goto'])

const steps = [
  { id: 1, label: 'Documentos' },
  { id: 2, label: 'Datos básicos' },
  { id: 3, label: 'Financiero' },
  { id: 4, label: 'Referencias' },
  { id: 5, label: 'SARLAFT' },
  { id: 6, label: 'Revisión y firma' },
]

function estaCompleto(id) {
  return props.pasosCompletos.includes(id)
}

function stepClass(id) {
  if (id === props.pasoActual) return 'text-verde border-b-verde'
  if (estaCompleto(id)) return 'text-verde-medio border-b-transparent'
  return 'text-gris-texto border-b-transparent'
}

function numClass(id) {
  if (id === props.pasoActual) return 'bg-verde text-white'
  if (estaCompleto(id)) return 'bg-verde-medio text-white'
  return 'bg-gris-borde text-gris-texto'
}
</script>
