import api from './api'

export async function crearProveedor(datos) {
  return api.post('/r44/proveedores', datos)
}

export async function crearBorrador(tipoPersona = 'juridica') {
  return api.post('/r44/proveedores', { tipo_persona: tipoPersona })
}

export async function actualizarProveedor(id, datos) {
  return api.patch(`/r44/proveedores/${id}`, datos)
}

export async function miFormulario() {
  return api.get('/r44/proveedores/mio')
}

export async function obtenerProveedores(params = {}) {
  return api.get('/r44/revisores/proveedores', { params })
}

export async function obtenerProveedor(id) {
  return api.get(`/r44/revisores/proveedores/${id}`)
}

export async function actualizarEstado(id, estado, observaciones = '') {
  return api.patch(`/r44/revisores/proveedores/${id}/estado`, { estado, observaciones })
}
