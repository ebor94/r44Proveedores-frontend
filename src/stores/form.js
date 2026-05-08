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
    if (!datos) return
    const d = datos
    // campos_r44 de n8n — aplica a jurídica y natural según tipo activo
    Object.assign(datosBasicosJuridica, {
      nit:                 d.nit                        ?? datosBasicosJuridica.nit,
      razon_social:        d.razon_social               ?? datosBasicosJuridica.razon_social,
      nombre_comercial:    d.nombre_comercial           ?? datosBasicosJuridica.nombre_comercial,
      direccion:           d.direccion_principal        ?? datosBasicosJuridica.direccion,
      ciudad:              d.municipio_nombre           ?? datosBasicosJuridica.ciudad,
      departamento:        d.departamento_nombre        ?? datosBasicosJuridica.departamento,
      telefono:            d.telefono_1                 ?? datosBasicosJuridica.telefono,
      correo:              d.correo_electronico         ?? datosBasicosJuridica.correo,
      ciiu:                d.actividad_principal_ciiu   ?? datosBasicosJuridica.ciiu,
      matricula_mercantil: d.matricula_numero           ?? datosBasicosJuridica.matricula_mercantil,
    })
    Object.assign(datosBasicosNatural, {
      cedula_numero:  d.numero_identificacion           ?? d.nit ?? datosBasicosNatural.cedula_numero,
      nombre_completo: d.nombre_completo                ?? datosBasicosNatural.nombre_completo,
      direccion:      d.direccion_principal             ?? datosBasicosNatural.direccion,
      ciudad:         d.municipio_nombre                ?? datosBasicosNatural.ciudad,
      departamento:   d.departamento_nombre             ?? datosBasicosNatural.departamento,
      telefono:       d.telefono_1                      ?? datosBasicosNatural.telefono,
      correo:         d.correo_electronico              ?? datosBasicosNatural.correo,
      ciiu:           d.actividad_principal_ciiu        ?? datosBasicosNatural.ciiu,
    })
    Object.assign(representanteLegal, {
      nombre:              d.rl_nombre            ?? representanteLegal.nombre,
      cedula:              d.rl_numero_doc        ?? representanteLegal.cedula,
      fecha_expedicion:    d.rl_fecha_expedicion  ?? representanteLegal.fecha_expedicion,
      ciudad_expedicion:   d.rl_lugar_expedicion  ?? representanteLegal.ciudad_expedicion,
      fecha_nacimiento:    d.rl_fecha_nacimiento  ?? representanteLegal.fecha_nacimiento,
      lugar_nacimiento:    d.rl_lugar_nacimiento  ?? representanteLegal.lugar_nacimiento,
      cedula_numero_serie: d.rl_cedula_serie      ?? representanteLegal.cedula_numero_serie,
    })
    Object.assign(financiero, {
      activos_totales:        d.total_activos           ?? financiero.activos_totales,
      pasivos_totales:        d.total_pasivos           ?? financiero.pasivos_totales,
      patrimonio:             d.total_patrimonio        ?? financiero.patrimonio,
      ingresos_operacionales: d.total_ingresos_brutos   ?? financiero.ingresos_operacionales,
      utilidad_neta:          d.utilidad_operacional    ?? financiero.utilidad_neta,
      anio_declaracion:       d.anio_gravable           ?? financiero.anio_declaracion,
    })
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
        ciudad:             data.pj_municipio || '',
        departamento:       data.pj_departamento || '',
        telefono:           data.pj_telefono_fijo || '',
        correo:             data.pj_correo || '',
        ciiu:               data.pj_ciiu_principal || '',
        matricula_mercantil: data.pj_matricula_numero || '',
        persona_contacto:   data.pj_persona_contacto || '',
        telefono_contacto:  data.pj_tel_contacto || '',
        productos_servicios: data.productos_servicios || '',
        empleados_total:    data.total_empleados || '',
        sistema_gestion:    data.tiene_sistema_gestion || '',
      })
      if (data.pj_nit) extraccion.estado = 'completada'
    } else {
      Object.assign(datosBasicosNatural, {
        cedula_numero:      data.pn_numero_documento || '',
        nombre_completo:    data.pn_nombre_completo || '',
        direccion:          data.pn_direccion_domicilio || '',
        ciudad:             data.pn_municipio_domicilio || '',
        departamento:       data.pn_dpto_domicilio || '',
        telefono:           data.pn_telefono_domicilio || '',
        correo:             data.pn_correo || '',
        ciiu:               data.pn_ciiu || '',
        productos_servicios: data.productos_servicios || '',
      })
      if (data.pn_numero_documento) extraccion.estado = 'completada'
    }

    const rl = data.representante_legal
    if (rl) {
      Object.assign(representanteLegal, {
        nombre:             rl.nombres_apellidos || rl.nombre || '',
        cedula:             rl.numero_documento  || rl.cedula || '',
        cargo:              rl.cargo || '',
        fecha_expedicion:   rl.fecha_expedicion  || '',
        ciudad_expedicion:  rl.ciudad_expedicion || '',
        fecha_nacimiento:   rl.fecha_nacimiento  || '',
        lugar_nacimiento:   rl.lugar_nacimiento  || '',
        cedula_numero_serie: rl.cedula_numero_serie || '',
      })
    }

    if (Array.isArray(data.accionistas) && data.accionistas.length) {
      accionistas.value = data.accionistas.map(a => ({
        nombre:                  a.razon_social_nombre     || a.nombre     || '',
        cedula_nit:              a.numero_documento        || a.cedula_nit || '',
        tipo_documento:          a.tipo_documento          || '',
        porcentaje:              a.porcentaje_participacion ?? a.porcentaje ?? '',
        administra_rec_publicos: a.administra_rec_publicos ?? false,
        es_pep:                  a.es_pep                  ?? false,
      }))
    }

    const fin = data.financiero
    if (fin) {
      Object.assign(financiero, {
        anio_declaracion:       fin.anio_gravable              || fin.anio_declaracion        || '',
        activos_totales:        fin.total_activos              || fin.activos_totales          || '',
        pasivos_totales:        fin.total_pasivos              || fin.pasivos_totales          || '',
        patrimonio:             fin.total_patrimonio           || fin.patrimonio               || '',
        ingresos_operacionales: fin.total_ingresos_brutos      || fin.ingresos_operacionales   || '',
        utilidad_neta:          fin.utilidad_operacional       || fin.utilidad_neta            || '',
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
        empresa:   r.empresa            || '',
        contacto:  r.contacto           || '',
        telefono:  r.telefono           || '',
        ciudad:    r.ciudad             || '',
        actividad: r.actividad_relacion || r.actividad || '',
      }))
    }

    const sar = data.sarlaft
    if (sar) {
      Object.assign(sarlaft, {
        es_pep:                 sar.es_pep                                          ?? null,
        familiar_pep:           sar.vinculo_familiar_pep   ?? sar.familiar_pep      ?? null,
        descripcion_actividad:  sar.descripcion_actividad                           || '',
        origen_fondos:          sar.declaracion_origen_fondos ?? sar.origen_fondos  ?? '',
        maneja_efectivo:        sar.maneja_recursos_publicos ?? sar.maneja_efectivo  ?? null,
        operaciones_extranjero: sar.opera_moneda_extranjera  ?? sar.operaciones_extranjero ?? null,
        paises_operacion:       sar.moneda_ext_cuales        ?? sar.paises_operacion ?? '',
        en_listas_restrictivas: sar.sancionado_laft         ?? sar.en_listas_restrictivas ?? null,
        declaracion_veracidad:  sar.declaracion_veracidad                           || false,
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
