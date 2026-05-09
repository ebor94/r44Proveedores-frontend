<template>
  <div>
    <SectionCard icon="🛡️" title="Gestión antilavado — SARLAFT"
      subtitle="Sección VI del R-44. Responda bajo la gravedad de juramento.">
      <div class="space-y-5">

        <!-- ¿Dispone de medios para prevenir LA/FT? -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium text-negro">¿Dispone de medios para prevenir el lavado de activos? <span class="text-rojo text-[11px]">*</span></span>
          <div class="flex gap-4">
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.tiene_sistema_control === true"  @change="s.tiene_sistema_control = true"  class="accent-verde" /> Sí</label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.tiene_sistema_control === false" @change="s.tiene_sistema_control = false" class="accent-verde" /> No</label>
          </div>
        </div>

        <!-- Documentos -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium text-negro">Documentos con los que cuenta:</span>
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" v-model="s.tiene_cod_conducta"          class="accent-verde" /> Código de Conducta</label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" v-model="s.tiene_manual_siplaft"        class="accent-verde" /> Manual SIPLAFT</label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" v-model="s.tiene_manual_procedimientos" class="accent-verde" /> Manual de Procedimientos</label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" v-model="s.tiene_manual_sarlaft"        class="accent-verde" /> Manual SARLAFT</label>
          </div>
        </div>

        <hr class="border-gris-borde" />

        <!-- ¿Maneja recursos públicos? -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium text-negro">¿Maneja recursos públicos? <span class="text-rojo text-[11px]">*</span></span>
          <div class="flex gap-4">
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.maneja_efectivo === true"  @change="s.maneja_efectivo = true"  class="accent-verde" /> Sí</label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.maneja_efectivo === false" @change="s.maneja_efectivo = false" class="accent-verde" /> No</label>
          </div>
        </div>

        <!-- ¿Es PEP? -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium text-negro">¿Es Persona Políticamente Expuesta (PEP)? <span class="text-rojo text-[11px]">*</span></span>
          <div class="flex gap-4">
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.es_pep === true"  @change="s.es_pep = true"  class="accent-verde" /> Sí</label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.es_pep === false" @change="s.es_pep = false" class="accent-verde" /> No</label>
          </div>
        </div>

        <!-- ¿Vínculo familiar PEP? -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium text-negro">¿Tiene vínculo familiar con un PEP? <span class="text-rojo text-[11px]">*</span></span>
          <div class="flex gap-4">
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.familiar_pep === true"  @change="s.familiar_pep = true"  class="accent-verde" /> Sí</label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.familiar_pep === false" @change="s.familiar_pep = false" class="accent-verde" /> No</label>
          </div>
        </div>

        <hr class="border-gris-borde" />

        <!-- ¿Operaciones moneda extranjera? -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium text-negro">¿Efectúa operaciones en moneda extranjera? <span class="text-rojo text-[11px]">*</span></span>
          <div class="flex gap-4">
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.operaciones_extranjero === true"  @change="s.operaciones_extranjero = true"  class="accent-verde" /> Sí</label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.operaciones_extranjero === false" @change="s.operaciones_extranjero = false" class="accent-verde" /> No</label>
          </div>
        </div>

        <div v-if="s.operaciones_extranjero" class="flex flex-col gap-1">
          <label class="text-xs font-medium text-negro">Países / monedas con las que opera</label>
          <input v-model="s.paises_operacion" class="input-base" placeholder="Ej: USA (USD), España (EUR)..." />
        </div>

        <!-- ¿Sancionado LA/FT? -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium text-negro">¿Ha sido sancionado por procesos de LA/FT? <span class="text-rojo text-[11px]">*</span></span>
          <div class="flex gap-4">
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.en_listas_restrictivas === true"  @change="s.en_listas_restrictivas = true"  class="accent-verde" /> Sí</label>
            <label class="flex items-center gap-1.5 text-sm cursor-pointer"><input type="radio" :checked="s.en_listas_restrictivas === false" @change="s.en_listas_restrictivas = false" class="accent-verde" /> No</label>
          </div>
        </div>

        <!-- Declaración origen de fondos -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-negro">Declaración del origen de fondos <span class="text-rojo text-[11px]">*</span></label>
          <textarea
            v-model="s.origen_fondos"
            class="input-base h-20 py-2.5 resize-y"
            placeholder="Declare el origen de sus recursos (ej: ingresos por actividad comercial lícita de prestación de servicios de publicidad digital)…"
          />
        </div>

      </div>
    </SectionCard>

    <div class="card bg-dorado-claro border-dorado/20 text-sm text-[#7d6608]">
      <strong>Declaración:</strong> Al continuar, el proveedor declara que la información suministrada es verídica y
      que la empresa y sus representantes no están vinculados a actividades de lavado de activos ni financiación del terrorismo.
    </div>
  </div>
</template>

<script setup>
import { useFormStore } from '@/stores/form'
import SectionCard from '@/components/form/SectionCard.vue'

const form = useFormStore()
const s = form.sarlaft
</script>
