<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-sm w-full p-8 text-center shadow-xl">
      <div class="w-16 h-16 bg-verde-claro rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
        ✅
      </div>
      <h2 class="font-serif text-2xl text-verde mb-2">¡Formulario enviado!</h2>
      <p class="text-sm text-gris-texto mb-4">
        Tu solicitud de vinculación ha sido registrada. El equipo de compras la revisará pronto.
      </p>
      <div class="bg-dorado-claro border border-dorado/30 rounded-lg px-4 py-3 mb-6">
        <div class="text-xs text-gris-texto mb-1">Número de radicado</div>
        <div class="font-serif text-xl text-verde font-bold tracking-widest">{{ radicado }}</div>
      </div>
      <p class="text-xs text-gris-texto">
        Guarda este número para consultar el estado de tu solicitud.
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  radicado: { type: String, required: true },
})
</script>
