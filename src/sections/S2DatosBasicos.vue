<template>
  <div>
    <!-- Toggle Persona Natural / Jurídica -->
    <div class="flex gap-3 mb-6">
      <button
        v-for="tipo in tipos" :key="tipo.id"
        class="flex-1 py-3 px-4 border-2 rounded-[10px] cursor-pointer font-sans text-sm font-medium transition-all text-center"
        :class="form.tipoPersona === tipo.id
          ? 'border-verde bg-verde-claro text-verde'
          : 'border-gris-borde bg-white text-gris-texto hover:border-verde-medio'"
        @click="form.tipoPersona = tipo.id"
      >
        <span class="text-xl block mb-1">{{ tipo.icon }}</span>
        {{ tipo.label }}
      </button>
    </div>

    <!-- Persona Jurídica -->
    <template v-if="form.tipoPersona === 'juridica'">
      <SectionCard icon="🏢" title="Identificación de la empresa">
        <div class="grid grid-cols-2 gap-4">
          <FormField label="NIT" v-model="d.nit" :readonly="autoJ.nit" :variant="autoJ.nit ? 'auto' : 'default'">
            <template #badge><AppBadge tipo="rut">RUT</AppBadge></template>
          </FormField>
          <FormField label="Razón social" v-model="d.razon_social" :readonly="autoJ.razon_social" :variant="autoJ.razon_social ? 'auto' : 'default'">
            <template #badge><AppBadge tipo="cam">Cámara</AppBadge></template>
          </FormField>
          <FormField label="Nombre comercial" v-model="d.nombre_comercial" placeholder="Si aplica" />
          <FormField label="Tipo de empresa" type="select" v-model="d.tipo_empresa" :options="tiposEmpresa" required />
          <FormField label="CIIU" v-model="d.ciiu" :readonly="autoJ.ciiu" :variant="autoJ.ciiu ? 'auto' : 'default'">
            <template #badge><AppBadge tipo="rut">RUT</AppBadge></template>
          </FormField>
          <FormField label="Matrícula mercantil" v-model="d.matricula_mercantil" :readonly="autoJ.matricula_mercantil" :variant="autoJ.matricula_mercantil ? 'auto' : 'default'">
            <template #badge><AppBadge tipo="cam">Cámara</AppBadge></template>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard icon="📍" title="Contacto y ubicación">
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Dirección" v-model="d.direccion" :readonly="autoJ.direccion" :variant="autoJ.direccion ? 'auto' : 'default'">
            <template #badge><AppBadge tipo="cam">Cámara</AppBadge></template>
          </FormField>
          <FormField label="Ciudad" v-model="d.ciudad" :readonly="autoJ.ciudad" :variant="autoJ.ciudad ? 'auto' : 'default'" />
          <FormField label="Departamento" v-model="d.departamento" />
          <FormField label="Teléfono empresa" v-model="d.telefono" :readonly="autoJ.telefono" :variant="autoJ.telefono ? 'auto' : 'default'">
            <template #badge><AppBadge tipo="cam">Cámara</AppBadge></template>
          </FormField>
          <FormField label="Correo empresa" type="email" v-model="d.correo" :readonly="autoJ.correo" :variant="autoJ.correo ? 'auto' : 'default'">
            <template #badge><AppBadge tipo="rut">RUT</AppBadge></template>
          </FormField>
          <FormField label="Página web" v-model="d.pagina_web" placeholder="https://..." />
        </div>
      </SectionCard>

      <SectionCard icon="👤" title="Persona de contacto">
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Nombre del contacto" v-model="d.persona_contacto" required />
          <FormField label="Teléfono del contacto" v-model="d.telefono_contacto" required />
        </div>
      </SectionCard>
    </template>

    <!-- Persona Natural -->
    <template v-else>
      <SectionCard icon="👤" title="Identificación personal">
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Cédula de ciudadanía" v-model="n.cedula_numero" :readonly="autoN.cedula_numero" :variant="autoN.cedula_numero ? 'auto' : 'default'" />
          <FormField label="Nombre completo" v-model="n.nombre_completo" :readonly="autoN.nombre_completo" :variant="autoN.nombre_completo ? 'auto' : 'default'" />
          <FormField label="CIIU" v-model="n.ciiu" :readonly="autoN.ciiu" :variant="autoN.ciiu ? 'auto' : 'default'" />
          <FormField label="Correo" type="email" v-model="n.correo" :readonly="autoN.correo" :variant="autoN.correo ? 'auto' : 'default'" />
          <FormField label="Dirección" v-model="n.direccion" :readonly="autoN.direccion" :variant="autoN.direccion ? 'auto' : 'default'" />
          <FormField label="Ciudad" v-model="n.ciudad" />
          <FormField label="Teléfono" v-model="n.telefono" :readonly="autoN.telefono" :variant="autoN.telefono ? 'auto' : 'default'" />
          <FormField label="Persona de contacto" v-model="n.persona_contacto" />
        </div>
      </SectionCard>
    </template>

    <!-- Representante legal (solo Jurídica) -->
    <template v-if="form.tipoPersona === 'juridica'">
      <SectionCard icon="🧑‍💼" title="Representante legal">
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Nombre completo" v-model="rl.nombre" :readonly="autoRl.nombre" :variant="autoRl.nombre ? 'auto' : 'default'">
            <template #badge><AppBadge tipo="cam">Cámara</AppBadge></template>
          </FormField>
          <FormField label="Cédula" v-model="rl.cedula" :readonly="autoRl.cedula" :variant="autoRl.cedula ? 'auto' : 'default'">
            <template #badge><AppBadge tipo="cam">Cámara</AppBadge></template>
          </FormField>
          <FormField label="Cargo" v-model="rl.cargo" required />
          <FormField label="Fecha de expedición CC" type="date" v-model="rl.fecha_expedicion" :readonly="autoRl.fecha_expedicion" :variant="autoRl.fecha_expedicion ? 'cedula' : 'default'">
            <template #badge><AppBadge tipo="ced">Cédula</AppBadge></template>
          </FormField>
          <FormField label="Ciudad de expedición" v-model="rl.ciudad_expedicion" :readonly="autoRl.ciudad_expedicion" :variant="autoRl.ciudad_expedicion ? 'cedula' : 'default'">
            <template #badge><AppBadge tipo="ced">Cédula</AppBadge></template>
          </FormField>
          <FormField label="Fecha de nacimiento" type="date" v-model="rl.fecha_nacimiento" :readonly="autoRl.fecha_nacimiento" :variant="autoRl.fecha_nacimiento ? 'cedula' : 'default'">
            <template #badge><AppBadge tipo="ced">Cédula</AppBadge></template>
          </FormField>
          <FormField label="Lugar de nacimiento" v-model="rl.lugar_nacimiento" :readonly="autoRl.lugar_nacimiento" :variant="autoRl.lugar_nacimiento ? 'cedula' : 'default'">
            <template #badge><AppBadge tipo="ced">Cédula</AppBadge></template>
          </FormField>
          <FormField label="Nº serie cédula (reverso)" v-model="rl.cedula_numero_serie" :readonly="autoRl.cedula_numero_serie" :variant="autoRl.cedula_numero_serie ? 'cedula' : 'default'">
            <template #badge><AppBadge tipo="ced">Cédula</AppBadge></template>
          </FormField>
        </div>
      </SectionCard>
    </template>

    <!-- Accionistas -->
    <SectionCard icon="👥" title="Accionistas / Socios con participación > 5%">
      <div class="space-y-2 mb-3">
        <div v-for="(ac, i) in form.accionistas" :key="i" class="grid grid-cols-3 gap-3 items-end">
          <FormField label="Nombre o Razón social" v-model="ac.nombre" />
          <FormField label="Cédula / NIT" v-model="ac.cedula_nit" />
          <div class="flex gap-2 items-end">
            <FormField label="% Participación" type="number" v-model="ac.porcentaje" placeholder="0" class="flex-1" />
            <button class="btn-secondary text-rojo border-red-200 h-[38px] px-3 mb-0" @click="form.eliminarAccionista(i)" v-if="form.accionistas.length > 1">✕</button>
          </div>
        </div>
      </div>
      <button class="btn-secondary text-sm" @click="form.agregarAccionista">+ Agregar accionista</button>
    </SectionCard>

    <!-- Productos y servicios -->
    <SectionCard icon="📦" title="Productos y servicios">
      <div class="grid grid-cols-2 gap-4">
        <FormField
          label="Productos/servicios que suministra"
          type="textarea"
          v-model="d.productos_servicios"
          placeholder="Describe los principales productos o servicios..."
          class="col-span-2"
          required
        />
        <FormField label="Total de empleados" type="number" v-model="d.empleados_total" placeholder="0" />
        <FormField label="Sistema de gestión certificado" v-model="d.sistema_gestion" placeholder="ISO 9001, OHSAS, etc." />
      </div>
    </SectionCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormStore } from '@/stores/form'
import SectionCard from '@/components/form/SectionCard.vue'
import FormField from '@/components/form/FormField.vue'
import AppBadge from '@/components/shared/AppBadge.vue'

const form = useFormStore()
const d = form.datosBasicosJuridica
const n = form.datosBasicosNatural
const rl = form.representanteLegal

const tipos = [
  { id: 'juridica', label: 'Persona Jurídica', icon: '🏢' },
  { id: 'natural', label: 'Persona Natural', icon: '👤' },
]

const tiposEmpresa = ['Privada', 'Pública', 'Mixta', 'Solidaria', 'Otra']

// Detecta qué campos se llenaron desde la extracción
const ext = computed(() => form.extraccion.datos ?? {})

const autoJ = computed(() => ({
  nit: !!ext.value.nit,
  razon_social: !!ext.value.razon_social,
  direccion: !!ext.value.direccion,
  ciudad: !!ext.value.ciudad,
  telefono: !!ext.value.telefono,
  correo: !!ext.value.correo,
  ciiu: !!ext.value.ciiu,
  matricula_mercantil: !!ext.value.matricula_mercantil,
}))

const autoN = computed(() => ({
  cedula_numero: !!ext.value.cedula_numero,
  nombre_completo: !!ext.value.nombre_completo,
  ciiu: !!ext.value.ciiu,
  correo: !!ext.value.correo,
  direccion: !!ext.value.direccion,
  telefono: !!ext.value.telefono,
}))

const autoRl = computed(() => ({
  nombre: !!ext.value.rl_nombre,
  cedula: !!ext.value.rl_cedula,
  fecha_expedicion: !!ext.value.fecha_expedicion,
  ciudad_expedicion: !!ext.value.ciudad_expedicion,
  fecha_nacimiento: !!ext.value.fecha_nacimiento,
  lugar_nacimiento: !!ext.value.lugar_nacimiento,
  cedula_numero_serie: !!ext.value.cedula_numero_serie,
}))
</script>
