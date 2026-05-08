import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useFormStore = defineStore('form', () => {
  const pasoActual = ref(1)
  const proveedorId = ref(null)
  const radicado = ref(null)

  // Estado de documentos subidos
  const documentos = reactive({
    rut: null,
    camara: null,
    renta: null,
    cedula: null,
  })

  // Estado de extracción
  const extraccion = reactive({
    estado: 'pendiente', // pendiente | procesando | completada | error
    datos: null,
  })

  // Tipo de persona
  const tipoPersona = ref('juridica') // juridica | natural

  // Sección II — Datos básicos (Persona Jurídica)
  const datosBasicosJuridica = reactive({
    nit: '',
    razon_social: '',
    nombre_comercial: '',
    tipo_empresa: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    telefono: '',
    correo: '',
    pagina_web: '',
    ciiu: '',
    matricula_mercantil: '',
    persona_contacto: '',
    telefono_contacto: '',
    productos_servicios: '',
    empleados_total: '',
    sistema_gestion: '',
  })

  // Sección II — Datos básicos (Persona Natural)
  const datosBasicosNatural = reactive({
    cedula_numero: '',
    nombre_completo: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    telefono: '',
    correo: '',
    ciiu: '',
    persona_contacto: '',
    telefono_contacto: '',
    productos_servicios: '',
  })

  // Representante legal
  const representanteLegal = reactive({
    nombre: '',
    cedula: '',
    cargo: '',
    fecha_expedicion: '',
    ciudad_expedicion: '',
    fecha_nacimiento: '',
    lugar_nacimiento: '',
    cedula_numero_serie: '',
  })

  // Accionistas
  const accionistas = ref([{ nombre: '', cedula_nit: '', porcentaje: '' }])

  // Sección IV — Financiero
  const financiero = reactive({
    activos_totales: '',
    pasivos_totales: '',
    patrimonio: '',
    ingresos_operacionales: '',
    utilidad_neta: '',
    anio_declaracion: '',
  })

  // Sección V — Referencias
  const referenciasBancarias = ref([
    { entidad: '', tipo_cuenta: '', numero_cuenta: '', ciudad: '' },
  ])
  const referenciasComerciales = ref([
    { empresa: '', contacto: '', telefono: '', actividad: '' },
  ])

  // Sección VI — SARLAFT
  const sarlaft = reactive({
    es_pep: null,
    familiar_pep: null,
    descripcion_actividad: '',
    origen_fondos: '',
    maneja_efectivo: null,
    operaciones_extranjero: null,
    paises_operacion: '',
    en_listas_restrictivas: null,
    declaracion_veracidad: false,
  })

  // Firma
  const firma = reactive({
    tipo: 'canvas', // canvas | imagen
    base64: '',
    aceptacion_terminos: false,
  })

  function setExtraccion(datos) {
    extraccion.datos = datos
    extraccion.estado = 'completada'
    // Poblar campos automáticos desde datos extraídos
    if (datos.rut || datos.camara || datos.renta || datos.cedula) {
      const d = datos
      Object.assign(datosBasicosJuridica, {
        nit: d.nit ?? datosBasicosJuridica.nit,
        razon_social: d.razon_social ?? datosBasicosJuridica.razon_social,
        direccion: d.direccion ?? datosBasicosJuridica.direccion,
        ciudad: d.ciudad ?? datosBasicosJuridica.ciudad,
        telefono: d.telefono ?? datosBasicosJuridica.telefono,
        correo: d.correo ?? datosBasicosJuridica.correo,
        ciiu: d.ciiu ?? datosBasicosJuridica.ciiu,
        matricula_mercantil: d.matricula_mercantil ?? datosBasicosJuridica.matricula_mercantil,
      })
      Object.assign(representanteLegal, {
        nombre: d.rl_nombre ?? representanteLegal.nombre,
        cedula: d.rl_cedula ?? representanteLegal.cedula,
        fecha_expedicion: d.fecha_expedicion ?? representanteLegal.fecha_expedicion,
        ciudad_expedicion: d.ciudad_expedicion ?? representanteLegal.ciudad_expedicion,
        fecha_nacimiento: d.fecha_nacimiento ?? representanteLegal.fecha_nacimiento,
        lugar_nacimiento: d.lugar_nacimiento ?? representanteLegal.lugar_nacimiento,
        cedula_numero_serie: d.cedula_numero_serie ?? representanteLegal.cedula_numero_serie,
      })
      Object.assign(financiero, {
        activos_totales: d.activos_totales ?? financiero.activos_totales,
        pasivos_totales: d.pasivos_totales ?? financiero.pasivos_totales,
        patrimonio: d.patrimonio ?? financiero.patrimonio,
        ingresos_operacionales: d.ingresos_operacionales ?? financiero.ingresos_operacionales,
        utilidad_neta: d.utilidad_neta ?? financiero.utilidad_neta,
        anio_declaracion: d.anio_declaracion ?? financiero.anio_declaracion,
      })
    }
  }

  function agregarAccionista() {
    accionistas.value.push({ nombre: '', cedula_nit: '', porcentaje: '' })
  }
  function eliminarAccionista(i) {
    accionistas.value.splice(i, 1)
  }

  function agregarRefBancaria() {
    if (referenciasBancarias.value.length < 2)
      referenciasBancarias.value.push({ entidad: '', tipo_cuenta: '', numero_cuenta: '', ciudad: '' })
  }
  function eliminarRefBancaria(i) {
    referenciasBancarias.value.splice(i, 1)
  }

  function agregarRefComercial() {
    if (referenciasComerciales.value.length < 2)
      referenciasComerciales.value.push({ empresa: '', contacto: '', telefono: '', actividad: '' })
  }
  function eliminarRefComercial(i) {
    referenciasComerciales.value.splice(i, 1)
  }

  function cargarDesdeAPI(data) {
    proveedorId.value = data.id
    tipoPersona.value = data.tipo_persona || 'juridica'
    if (data.radicado) radicado.value = data.radicado

    if (data.tipo_persona === 'juridica') {
      Object.assign(datosBasicosJuridica, {
        nit:                data.pj_nit || '',
        razon_social:       data.pj_razon_social || '',
        nombre_comercial:   data.pj_nombre_comercial || '',
        tipo_empresa:       data.pj_tipo_empresa || '',
        direccion:          data.pj_direccion || '',
        ciudad:             data.pj_ciudad || '',
        departamento:       data.pj_departamento || '',
        telefono:           data.pj_telefono || '',
        correo:             data.pj_correo || '',
        pagina_web:         data.pj_pagina_web || '',
        ciiu:               data.pj_ciiu || '',
        matricula_mercantil:  data.pj_matricula_mercantil || '',
        persona_contacto:   data.pj_persona_contacto || '',
        telefono_contacto:  data.pj_telefono_contacto || '',
        productos_servicios: data.pj_productos_servicios || '',
        empleados_total:    data.pj_empleados_total || '',
        sistema_gestion:    data.pj_sistema_gestion || '',
      })
      if (data.pj_nit) extraccion.estado = 'completada'
    } else {
      Object.assign(datosBasicosNatural, {
        cedula_numero:      data.pn_cedula || '',
        nombre_completo:    data.pn_nombre_completo || '',
        direccion:          data.pn_direccion || '',
        ciudad:             data.pn_ciudad || '',
        departamento:       data.pn_departamento || '',
        telefono:           data.pn_telefono || '',
        correo:             data.pn_correo || '',
        ciiu:               data.pn_ciiu || '',
        persona_contacto:   data.pn_persona_contacto || '',
        telefono_contacto:  data.pn_telefono_contacto || '',
        productos_servicios: data.pn_productos_servicios || '',
      })
      if (data.pn_cedula) extraccion.estado = 'completada'
    }

    const rl = data.representante_legal
    if (rl) {
      Object.assign(representanteLegal, {
        nombre:            rl.nombre || '',
        cedula:            rl.cedula || '',
        cargo:             rl.cargo || '',
        fecha_expedicion:  rl.fecha_expedicion || '',
        ciudad_expedicion: rl.ciudad_expedicion || '',
        fecha_nacimiento:  rl.fecha_nacimiento || '',
        lugar_nacimiento:  rl.lugar_nacimiento || '',
        cedula_numero_serie: rl.cedula_numero_serie || '',
      })
    }

    if (Array.isArray(data.accionistas) && data.accionistas.length) {
      accionistas.value = data.accionistas.map(a => ({
        nombre:    a.nombre || '',
        cedula_nit: a.cedula_nit || '',
        porcentaje: a.porcentaje || '',
      }))
    }

    const fin = data.financiero
    if (fin) {
      Object.assign(financiero, {
        activos_totales:       fin.activos_totales || '',
        pasivos_totales:       fin.pasivos_totales || '',
        patrimonio:            fin.patrimonio || '',
        ingresos_operacionales: fin.ingresos_operacionales || '',
        utilidad_neta:         fin.utilidad_neta || '',
        anio_declaracion:      fin.anio_declaracion || '',
      })
    }

    if (Array.isArray(data.referencias_bancarias) && data.referencias_bancarias.length) {
      referenciasBancarias.value = data.referencias_bancarias.map(r => ({
        entidad:      r.entidad || '',
        tipo_cuenta:  r.tipo_cuenta || '',
        numero_cuenta: r.numero_cuenta || '',
        ciudad:       r.ciudad || '',
      }))
    }

    if (Array.isArray(data.referencias_comerciales) && data.referencias_comerciales.length) {
      referenciasComerciales.value = data.referencias_comerciales.map(r => ({
        empresa:   r.empresa || '',
        contacto:  r.contacto || '',
        telefono:  r.telefono || '',
        actividad: r.actividad || '',
      }))
    }

    const sar = data.sarlaft
    if (sar) {
      Object.assign(sarlaft, {
        es_pep:                sar.es_pep ?? null,
        familiar_pep:          sar.familiar_pep ?? null,
        descripcion_actividad: sar.descripcion_actividad || '',
        origen_fondos:         sar.origen_fondos || '',
        maneja_efectivo:       sar.maneja_efectivo ?? null,
        operaciones_extranjero: sar.operaciones_extranjero ?? null,
        paises_operacion:      sar.paises_operacion || '',
        en_listas_restrictivas: sar.en_listas_restrictivas ?? null,
        declaracion_veracidad:  sar.declaracion_veracidad || false,
      })
    }
  }

  function reset() {
    pasoActual.value = 1
    proveedorId.value = null
    radicado.value = null
    Object.assign(documentos, { rut: null, camara: null, renta: null, cedula: null })
    Object.assign(extraccion, { estado: 'pendiente', datos: null })
  }

  return {
    pasoActual, proveedorId, radicado,
    documentos, extraccion,
    tipoPersona,
    datosBasicosJuridica, datosBasicosNatural,
    representanteLegal, accionistas,
    financiero,
    referenciasBancarias, referenciasComerciales,
    sarlaft, firma,
    setExtraccion,
    cargarDesdeAPI,
    agregarAccionista, eliminarAccionista,
    agregarRefBancaria, eliminarRefBancaria,
    agregarRefComercial, eliminarRefComercial,
    reset,
  }
})
