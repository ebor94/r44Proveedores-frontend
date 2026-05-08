import api from './api'

export async function subirDocumentos(proveedorId, archivos) {
  const fd = new FormData()
  Object.entries(archivos).forEach(([tipo, file]) => {
    if (file) fd.append(tipo, file)
  })
  return api.post(`/r44/documentos/${proveedorId}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function estadoExtraccion(proveedorId) {
  return api.get(`/r44/extraccion/estado/${proveedorId}`)
}

// Polling hasta que el estado sea 'extraccion_completada' o se agote el tiempo
export function iniciarPolling(proveedorId, onComplete, onError, intervalo = 5000, maxIntentos = 36) {
  let intentos = 0
  const timer = setInterval(async () => {
    intentos++
    try {
      const res = await estadoExtraccion(proveedorId)
      if (res.data?.estado === 'extraccion_completada') {
        clearInterval(timer)
        onComplete(res.data)
      } else if (intentos >= maxIntentos) {
        clearInterval(timer)
        onError(new Error('Tiempo de espera agotado para la extracción'))
      }
    } catch (err) {
      clearInterval(timer)
      onError(err)
    }
  }, intervalo)
  return () => clearInterval(timer)
}
