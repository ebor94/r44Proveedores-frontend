<template>
  <span class="inline-flex items-center text-[10px] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded ml-1 align-middle" :class="cls">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tipo: { type: String, default: 'man' }, // rut | cam | ren | ced | man
})

const map = {
  rut: 'bg-[#e8f0fe] text-azul',
  cam: 'bg-[#fdebd0] text-[#784212]',
  ren: 'bg-[#e8f8f5] text-verde-medio',
  ced: 'bg-cedula text-cedula-texto',
  man: 'bg-[#fef9e7] text-[#7d6608] border border-[#f0e68c]',
}

const cls = computed(() => map[props.tipo] ?? map.man)
</script>
