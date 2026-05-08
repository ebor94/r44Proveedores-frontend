# Portal de Proveedores — Serfunorte / Los Olivos
## Contexto del proyecto

Sistema de vinculación y actualización de proveedores para **Servicios Funerarios
Cooperativos del Norte de Santander — Serfunorte / Los Olivos**, con sede en
Cúcuta, Colombia. El sistema digitaliza el formulario interno **R-44 Versión 09**,
extrae información de documentos oficiales colombianos con IA y almacena todo en
MySQL para reportes.

---

## Arquitectura de red (producción)

| Componente | IP / URL | Puerto |
|---|---|---|
| Servidor backend el mismo mantix backend
| Servidor n8n (orquestador) | 192.9.17.10 | 5678 (solo LAN) |
| Base de datos MySQL | serfuweb (misma red) | 3306 |
| API pública del backend | https://mantix-api.losolivoscucuta.com:8444/api | — |
| Claude API (extracción) | https://api.anthropic.com | — |

**Regla de red:** El frontend se comunica con el backend por HTTPS. El backend
llama a n8n por red interna (192.9.17.10:5678). n8n nunca está expuesto a internet.

---

## Stack tecnológico

- **Backend:** Node.js + Express
- **Base de datos:** MySQL — base de datos `serfuweb`
- **Orquestador:** n8n v1.113.3 instalado en 192.9.17.10
- **Extracción IA:** Claude API (claude-opus-4-5) vía n8n
- **Frontend:** vue + tailwind
- **Autenticación:** JWT
- **Upload archivos:** Multer (PDFs e imágenes)

---

## Base de datos — tablas r44_* en serfuweb

Todas las tablas del módulo usan el prefijo `r44_` para no colisionar con las
tablas existentes de Mantix en la misma base de datos.

### Tablas principales

| Tabla | Descripción | Sección R-44 |
|---|---|---|
| `r44_usuarios` | Cuentas del portal (proveedores + revisores) | — |
| `r44_proveedores` | Tabla central. Persona Natural y Jurídica | II y III |
| `r44_datos_representante_legal` | Datos del R.L. + campos de cédula | II |
| `r44_accionistas` | Accionistas >5% | II |
| `r44_info_financiera` | Datos financieros de Renta + Cámara | IV |
| `r44_referencias_bancarias` | Referencias bancarias (2 máx.) | V |
| `r44_referencias_comerciales` | Referencias comerciales (2 máx.) | V |
| `r44_sarlaft_datos` | Sección SARLAFT / SAGRILAFT | VI |
| `r44_documentos_adjuntos` | Control de archivos subidos | — |
| `r44_extraccion_llm` | Log de cada llamada a Claude API | — |
| `r44_firma_declaracion` | Firma digital + aceptación | VII–IX |
| `r44_revision_serfunorte` | Revisión interna (solo revisores) | IX |

### Vistas disponibles

- `v_r44_proveedores_resumen` — dashboard de revisores
- `v_r44_documentos_pendientes` — cola para n8n
- `v_r44_estadisticas` — reportes ejecutivos

### Trigger automático

`trg_r44_generar_radicado` genera `SFN-AAAA-NNNNNN` al insertar en
`r44_proveedores`.

### Campos clave de r44_datos_representante_legal

Los siguientes campos se extraen automáticamente de la **cédula de ciudadanía**
(ya NO son ingreso manual):
- `fecha_expedicion` — extraída de cédula CC
- `ciudad_expedicion` — extraída de cédula CC
- `fecha_nacimiento` — extraída de cédula CC
- `lugar_nacimiento` — extraída de cédula CC
- `cedula_numero_serie` — reverso de la cédula

---

## Flujo de extracción de documentos (asíncrono)

```
1. Proveedor sube 4 documentos en el portal
2. Backend guarda archivos en disco (/uploads/proveedor_id/)
3. Backend hace POST a n8n (192.9.17.10:5678/webhook/procesar-documentos)
4. n8n responde {"acknowledged": true} en < 1 segundo
5. n8n procesa los 4 documentos EN PARALELO con Claude API:
   - RUT (PDF)
   - Cámara de Comercio (PDF)
   - Declaración de Renta (PDF)
   - Cédula del Representante Legal (PDF o imagen JPG/PNG)
6. n8n consolida los campos y escribe en MySQL:
   - r44_extraccion_llm (log completo)
   - r44_proveedores (campos extraídos)
   - r44_info_financiera (datos financieros)
   - r44_datos_representante_legal (datos RL + cédula)
7. n8n hace POST al callback del backend
8. Backend notifica al proveedor (correo o polling)
```

### Payload que el backend envía a n8n

```json
{
  "proveedor_id": 123,
  "callback_url": "https://mantix-api.losolivoscucuta.com:8444/api/extraccion/resultado",
  "archivos": {
    "rut":    "/uploads/123/rut.pdf",
    "camara": "/uploads/123/camara.pdf",
    "renta":  "/uploads/123/renta.pdf",
    "cedula": "/uploads/123/cedula.pdf"
  }
}
```

---

## Documentos que el proveedor debe adjuntar

| # | Documento | Tipos aceptados | Campos que extrae |
|---|---|---|---|
| 1 | RUT (DIAN) | PDF | NIT, nombre, dirección, CIIU, correo, teléfono |
| 2 | Cámara de Comercio | PDF | Razón social, representante legal, financiero, matrícula |
| 3 | Declaración de Renta | PDF | Activos, pasivos, patrimonio, ingresos, utilidad |
| 4 | Cédula del R.L. | PDF, JPG, PNG | Fecha/lugar expedición, fecha/lugar nacimiento |

---

## Campos MANUAL vs AUTO en el formulario R-44

### Siempre manuales (no aparecen en documentos)
- Tipo de empresa (Mixta/Privada/Pública/Solidaria/Otra)
- Persona de contacto y teléfono
- Accionistas y % de participación
- Productos/servicios que suministra
- Sistema de gestión certificado
- Total de empleados
- Referencias bancarias (entidad, cuenta, ciudad)
- Referencias comerciales (empresa, contacto, actividad)
- Toda la sección SARLAFT (VI)
- Firma digital

### Automáticos desde documentos (fondo verde = RUT/Cámara/Renta, fondo morado = Cédula)
- Todo lo demás: NIT, nombre, dirección, CIIU, financiero, datos RL, etc.

---

## Prioridad de fuentes para campos duplicados

Cuando un campo aparece en varios documentos, se aplica esta prioridad:

1. **Renta** > Cámara > RUT (para campos financieros)
2. **Cámara** > RUT (para dirección, teléfono, correo de la empresa)
3. **Cédula** > todo (para fecha/lugar expedición y nacimiento del R.L.)

---

## Roles de usuario

| Rol | Permisos |
|---|---|
| `proveedor` | Solo su propio formulario R-44 |
| `revisor_compras` | Ver y aprobar/rechazar proveedores |
| `revisor_excelencia` | Ver y verificar listas SARLAFT |
| `admin` | Acceso completo |

---


```

---

## Variables de entorno (.env)

```env
# Servidor
PORT=8444
NODE_ENV=production

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=serfuweb
DB_USER=root
DB_PASSWORD=Olivos*963.

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=8h

# n8n (red interna)
N8N_WEBHOOK_URL=http://192.9.17.10:5678/webhook/procesar-documentos

# Callback (backend público)
CALLBACK_URL==https://mantix-api.losolivoscucuta.com:8444/api/extraccion/resultado

# Almacenamiento
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10

# Email (notificaciones al proveedor)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@losolivoscucuta.com
```

---

## Convenciones de código

- Async/await en todos los controladores (sin callbacks)
- Manejo de errores con try/catch y middleware de error global
- Respuestas JSON siempre con estructura `{ ok: true/false, data: {}, error: "" }`
- Logs con console.error para errores, console.log para info relevante
- Nombres de variables en camelCase, tablas MySQL en snake_case con prefijo r44_
- Archivos subidos renombrados a `{tipo}_{timestamp}.{ext}` para evitar colisiones

---


## Notas importantes para el desarrollo

1. **n8n procesa en paralelo** los 4 documentos. El backend no espera — solo
   recibe el ACK y actualiza estado a `documentos_cargados`. Cuando n8n termina,
   llama al callback y el estado pasa a `extraccion_completada`.

2. **La cédula puede ser imagen** (JPG/PNG) además de PDF. El nodo Claude en n8n
   cambia el `type` del mensaje a `image` si no es PDF.

3. **El radicado** se genera automáticamente por trigger MySQL al insertar en
   `r44_proveedores`. No lo generes en el backend.

4. **Persona Natural vs Jurídica** usan columnas diferentes en `r44_proveedores`
   (prefijo `pn_` vs `pj_`). El campo `tipo_persona` determina cuál sección
   mostrar en el portal.

5. **La firma digital** se guarda como base64 en
   `r44_firma_declaracion.firma_electronica`.

6. **Seguridad:** Los archivos subidos deben guardarse fuera del directorio público.
   Solo el backend accede a ellos para enviarlos a n8n.
