<template>
  <div class="flex flex-col gap-3">
    <!-- Tabs -->
    <div class="flex gap-2">
      <button
        v-for="tab in tabs" :key="tab.id"
        class="px-4 py-1.5 rounded text-sm font-medium border transition-colors"
        :class="modo === tab.id ? 'bg-verde text-white border-verde' : 'bg-white text-gris-texto border-gris-borde hover:border-verde-medio'"
        @click="modo = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Canvas -->
    <div v-show="modo === 'canvas'" class="border border-gris-borde rounded-lg overflow-hidden bg-white">
      <div class="flex items-center gap-2 px-3 py-2 bg-gris-fondo border-b border-gris-borde">
        <span class="text-xs text-gris-texto">Color:</span>
        <button
          v-for="c in colores" :key="c"
          class="w-5 h-5 rounded-full border-2 transition-all"
          :style="{ background: c, borderColor: colorActual === c ? '#1a4a2e' : 'transparent' }"
          @click="setColor(c)"
        />
        <div class="ml-auto flex gap-2">
          <button class="text-xs text-gris-texto hover:text-negro transition-colors" @click="undo">↩ Deshacer</button>
          <button class="text-xs text-rojo hover:text-rojo/80 transition-colors" @click="limpiar">✕ Limpiar</button>
        </div>
      </div>
      <canvas
        ref="canvasRef"
        class="w-full touch-none"
        :width="canvasW"
        :height="180"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="endDraw"
        @mouseleave="endDraw"
        @touchstart.prevent="startDrawTouch"
        @touchmove.prevent="drawTouch"
        @touchend="endDraw"
      />
    </div>

    <!-- Subir imagen -->
    <div v-show="modo === 'imagen'" class="border-2 border-dashed border-gris-borde rounded-lg p-6 text-center cursor-pointer hover:border-verde-medio hover:bg-verde-claro transition-all" @click="inputImgRef?.click()">
      <div v-if="imagenPreview" class="flex justify-center">
        <img :src="imagenPreview" class="max-h-32 object-contain" />
      </div>
      <template v-else>
        <div class="text-3xl mb-2">🖼️</div>
        <div class="text-sm font-medium text-negro">Haz clic para subir tu firma</div>
        <div class="text-xs text-gris-texto">JPG, PNG · máx. 2 MB</div>
      </template>
      <input ref="inputImgRef" type="file" accept=".jpg,.jpeg,.png" class="hidden" @change="onImagen" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const emit = defineEmits(['update:modelValue'])

const tabs = [
  { id: 'canvas', label: '✏️ Dibujar' },
  { id: 'imagen', label: '📁 Subir imagen' },
]

const modo = ref('canvas')
const canvasRef = ref(null)
const inputImgRef = ref(null)
const canvasW = ref(600)
const colores = ['#000000', '#1a4a2e', '#1a5276', '#c9952a']
const colorActual = ref('#000000')
const dibujando = ref(false)
const trazos = ref([])
const trazoActual = ref([])
const imagenPreview = ref(null)
let ctx = null

onMounted(() => {
  const canvas = canvasRef.value
  canvasW.value = canvas.parentElement?.offsetWidth ?? 600
  ctx = canvas.getContext('2d')
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = colorActual.value
})

function getPos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }
}

function startDraw(e) {
  dibujando.value = true
  const pos = getPos(e)
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
  trazoActual.value = [{ ...pos, color: colorActual.value }]
}

function draw(e) {
  if (!dibujando.value) return
  const pos = getPos(e)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
  trazoActual.value.push({ ...pos, color: colorActual.value })
}

function endDraw() {
  if (!dibujando.value) return
  dibujando.value = false
  if (trazoActual.value.length > 0) {
    trazos.value.push([...trazoActual.value])
    trazoActual.value = []
    emitBase64()
  }
}

function startDrawTouch(e) {
  const touch = e.touches[0]
  startDraw({ clientX: touch.clientX, clientY: touch.clientY })
}
function drawTouch(e) {
  const touch = e.touches[0]
  draw({ clientX: touch.clientX, clientY: touch.clientY })
}

function setColor(c) {
  colorActual.value = c
  if (ctx) ctx.strokeStyle = c
}

function redibujar() {
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  for (const trazo of trazos.value) {
    ctx.beginPath()
    ctx.strokeStyle = trazo[0].color
    ctx.moveTo(trazo[0].x, trazo[0].y)
    for (let i = 1; i < trazo.length; i++) ctx.lineTo(trazo[i].x, trazo[i].y)
    ctx.stroke()
  }
  ctx.strokeStyle = colorActual.value
}

function undo() {
  trazos.value.pop()
  redibujar()
  emitBase64()
}

function limpiar() {
  trazos.value = []
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  emit('update:modelValue', '')
}

function emitBase64() {
  const b64 = canvasRef.value.toDataURL('image/png')
  emit('update:modelValue', b64)
}

function onImagen(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    imagenPreview.value = ev.target.result
    emit('update:modelValue', ev.target.result)
  }
  reader.readAsDataURL(file)
}
</script>
