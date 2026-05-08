<template>
  <div class="card">
    <div v-if="icon || title" class="flex items-center gap-2.5 mb-5 pb-3 border-b border-verde-claro">
      <div v-if="icon" class="w-8 h-8 bg-verde-claro rounded-lg flex items-center justify-center text-[15px] shrink-0">
        {{ icon }}
      </div>
      <div>
        <div class="text-[15px] font-semibold text-verde">{{ title }}</div>
        <div v-if="subtitle" class="text-xs text-gris-texto">{{ subtitle }}</div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  title: String,
  subtitle: String,
})
</script>
