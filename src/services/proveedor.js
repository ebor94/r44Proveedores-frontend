import api from './api'

export async function crearProveedor(datos) {
  return api.post('/proveedores', datos)
}

export async function obtenerProveedores(params = {}) {
  return api.get('/revisores/proveedores', { params })
}

export async function obtenerProveedor(id) {
  return api.get(`/revisores/proveedores/${id}`)
}

export async function actualizarEstado(id, estado, observaciones = '') {
  return api.patch(`/revisores/proveedores/${id}/estado`, { estado, observaciones })
}
