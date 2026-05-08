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
    agregarAccionista, eliminarAccionista,
    agregarRefBancaria, eliminarRefBancaria,
    agregarRefComercial, eliminarRefComercial,
    reset,
  }
})
