# 🧪 TEST COMPLETO: Email + Google Meet

## **Configuración Previa**

### 1. **Agregar a `.env`:**
```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password-de-gmail
```

### 2. **Reiniciar servidor:**
```bash
yarn start:dev
```

---

## **🔹 Paso 1: Crear Usuario de Prueba**

```graphql
mutation {
  createUsuario(createUsuarioInput: {
    rut: "12.345.678-9"
    nombre: "María"
    apellidos: "González López"
    correo: "tu-email-personal@gmail.com"  # 👈 Tu email para recibir prueba
    telefono: "+56912345678"
    direccion: "Av. Principal 123"
  }) {
    id
    nombre
    apellidos
    correo
    rut
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "createUsuario": {
      "id": "uuid-generado",
      "nombre": "María",
      "apellidos": "González López",
      "correo": "tu-email-personal@gmail.com",
      "rut": "12.345.678-9"
    }
  }
}
```

---

## **🔹 Paso 2A: Consulta PRESENCIAL (Sin Google Meet)**

```graphql
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-25"
    hora: "10:00"
    tipo: PRESENCIAL
    motivo: "Consulta inicial de evaluación psicológica"
    usuarioId: "REEMPLAZA_CON_ID_DEL_USUARIO"
  }) {
    id
    fecha
    hora
    tipo
    motivo
    googleEventId
    googleMeetLink
    usuario {
      id
      nombre
      apellidos
      correo
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "createConsulta": {
      "id": "uuid-consulta",
      "fecha": "2024-12-25T00:00:00.000Z",
      "hora": "10:00",
      "tipo": "PRESENCIAL",
      "motivo": "Consulta inicial de evaluación psicológica",
      "googleEventId": "calendar-event-id",
      "googleMeetLink": null,  // 👈 NULL porque es presencial
      "usuario": {
        "id": "uuid-usuario",
        "nombre": "María",
        "apellidos": "González López",
        "correo": "tu-email-personal@gmail.com"
      }
    }
  }
}
```

### **Verificaciones:**
- ✅ **Google Calendar**: Evento aparece sin Google Meet
- ✅ **Email**: Enviado sin sección de videoconferencia
- ✅ **Base de datos**: `googleMeetLink` = null

---

## **🔹 Paso 2B: Consulta ONLINE (Con Google Meet)**

```graphql
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-26"
    hora: "14:00"
    tipo: ONLINE
    motivo: "Sesión de seguimiento terapéutico online"
    usuarioId: "REEMPLAZA_CON_ID_DEL_USUARIO"
  }) {
    id
    fecha
    hora
    tipo
    motivo
    googleEventId
    googleMeetLink
    usuario {
      id
      nombre
      apellidos
      correo
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "createConsulta": {
      "id": "uuid-consulta-online",
      "fecha": "2024-12-26T00:00:00.000Z",
      "hora": "14:00",
      "tipo": "ONLINE",
      "motivo": "Sesión de seguimiento terapéutico online",
      "googleEventId": "calendar-event-id-online",
      "googleMeetLink": "https://meet.google.com/abc-defg-hij",  // 👈 LINK GENERADO
      "usuario": {
        "id": "uuid-usuario",
        "nombre": "María",
        "apellidos": "González López",
        "correo": "tu-email-personal@gmail.com"
      }
    }
  }
}
```

### **Verificaciones:**
- ✅ **Google Calendar**: Evento aparece **CON** botón "Unirse con Google Meet"
- ✅ **Email**: Enviado **CON** sección de videoconferencia y botón Meet
- ✅ **Base de datos**: `googleMeetLink` = URL válida de Meet

---

## **🔹 Paso 3: Verificar Todas las Consultas**

```graphql
query {
  consultas {
    id
    fecha
    hora
    tipo
    motivo
    googleEventId
    googleMeetLink
    usuario {
      nombre
      apellidos
      correo
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "consultas": [
      {
        "id": "uuid-presencial",
        "fecha": "2024-12-25T00:00:00.000Z",
        "hora": "10:00",
        "tipo": "PRESENCIAL",
        "motivo": "Consulta inicial de evaluación psicológica",
        "googleEventId": "calendar-event-id",
        "googleMeetLink": null,
        "usuario": {
          "nombre": "María",
          "apellidos": "González López",
          "correo": "tu-email-personal@gmail.com"
        }
      },
      {
        "id": "uuid-online",
        "fecha": "2024-12-26T00:00:00.000Z",
        "hora": "14:00",
        "tipo": "ONLINE",
        "motivo": "Sesión de seguimiento terapéutico online",
        "googleEventId": "calendar-event-id-online",
        "googleMeetLink": "https://meet.google.com/abc-defg-hij",
        "usuario": {
          "nombre": "María",
          "apellidos": "González López",
          "correo": "tu-email-personal@gmail.com"
        }
      }
    ]
  }
}
```

---

## **🔹 Paso 4: Probar Actualización (Cambiar de Presencial a Online)**

```graphql
mutation {
  updateConsulta(
    id: "ID_DE_CONSULTA_PRESENCIAL"
    updateConsultaInput: {
      tipo: ONLINE
      motivo: "Cambio a modalidad online - Sesión de seguimiento"
    }
  ) {
    id
    fecha
    hora
    tipo
    motivo
    googleEventId
    googleMeetLink
    usuario {
      nombre
      correo
    }
  }
}
```

**Resultado esperado:**
- ✅ **Google Calendar**: Evento actualizado **CON** Google Meet
- ✅ **Base de datos**: `googleMeetLink` ahora tiene URL
- ✅ **Respuesta**: Incluye el nuevo `googleMeetLink`

---

## **📧 Verificación de Emails**

### **Email para Consulta PRESENCIAL:**
```
Asunto: ✅ Confirmación de Consulta Psicológica - martes, 25 de diciembre de 2024

📅 CONSULTA CONFIRMADA

Estimado/a María González López,

Su consulta psicológica ha sido confirmada con los siguientes detalles:

📅 Fecha: martes, 25 de diciembre de 2024
🕐 Hora: 10:00 - 10:50
📍 Modalidad: PRESENCIAL
📝 Motivo: Consulta inicial de evaluación psicológica

📅 Agregar a su calendario:
[Google Calendar] [Outlook]

📋 Instrucciones importantes:
• Llegue 10 minutos antes de la cita
• Traiga un documento de identidad
• Si necesita cancelar, avise con al menos 24 horas de anticipación

✅ Confirmar Asistencia    ❌ Cancelar Consulta
```

### **Email para Consulta ONLINE:**
```
Asunto: ✅ Confirmación de Consulta Psicológica - miércoles, 26 de diciembre de 2024

📅 CONSULTA CONFIRMADA

Estimado/a María González López,

Su consulta psicológica ha sido confirmada con los siguientes detalles:

📅 Fecha: miércoles, 26 de diciembre de 2024
🕐 Hora: 14:00 - 14:50
📍 Modalidad: ONLINE
📝 Motivo: Sesión de seguimiento terapéutico online

🎥 REUNIÓN ONLINE
Su consulta será realizada por videoconferencia:
      [📹 Unirse a Google Meet]

Importante: Asegúrese de probar su cámara y micrófono antes de la consulta.

📅 Agregar a su calendario:
[Google Calendar] [Outlook]

📋 Instrucciones importantes:
• Conéctese 5 minutos antes de la hora programada
• Asegúrese de tener una conexión estable a internet
• Pruebe su cámara y micrófono previamente

✅ Confirmar Asistencia    ❌ Cancelar Consulta
```

---

## **🎯 Vista del Psicólogo en Google Calendar**

### **Consulta Presencial:**
```
📅 Consulta PRESENCIAL - María González López
🕐 25 dic 2024, 10:00 - 10:50
📝 Motivo: Consulta inicial de evaluación psicológica
   Paciente: María González López
   Correo: tu-email-personal@gmail.com
   Teléfono: +56912345678
```

### **Consulta Online:**
```
📅 Consulta ONLINE - María González López
🕐 26 dic 2024, 14:00 - 14:50
🎥 [Unirse con Google Meet] ← BOTÓN AUTOMÁTICO EN AZUL
📝 Motivo: Sesión de seguimiento terapéutico online
   Paciente: María González López
   Correo: tu-email-personal@gmail.com
   Teléfono: +56912345678
```

---

## **✅ Checklist de Verificación**

### **🔸 Funcionalidad Base:**
- [ ] Crear usuario exitosamente
- [ ] Crear consulta presencial sin errores
- [ ] Crear consulta online sin errores
- [ ] Ver todas las consultas con campos correctos

### **🔸 Google Calendar:**
- [ ] Evento presencial aparece sin Meet
- [ ] Evento online aparece con botón Meet
- [ ] Información del paciente visible en eventos
- [ ] Horarios correctos en zona horaria Chile

### **🔸 Google Meet:**
- [ ] Consulta presencial: `googleMeetLink` = null
- [ ] Consulta online: `googleMeetLink` = URL válida
- [ ] Botón Meet funciona desde Google Calendar
- [ ] Link Meet accesible desde GraphQL

### **🔸 Email:**
- [ ] Email recibido para consulta presencial
- [ ] Email recibido para consulta online
- [ ] Sección Meet presente solo en online
- [ ] Enlaces de calendario funcionan
- [ ] Botones de confirmación/cancelación funcionan

### **🔸 Base de Datos:**
- [ ] Campo `googleEventId` guardado correctamente
- [ ] Campo `googleMeetLink` guardado para online
- [ ] Campo `googleMeetLink` null para presencial
- [ ] Relaciones usuario-consulta intactas

---

## **🚨 Posibles Errores y Soluciones**

### **Error: "Email not sent"**
**Problema**: Configuración de Gmail
**Solución**: Verificar `EMAIL_USER` y `EMAIL_PASSWORD` en `.env`

### **Error: "Google Meet not created"**
**Problema**: Permisos del Service Account
**Solución**: Verificar que el calendario esté compartido con el Service Account

### **Error: "Field googleMeetLink doesn't exist"**
**Problema**: Schema no regenerado
**Solución**: Reiniciar el servidor con `yarn start:dev`

### **Error: "attendees not allowed"**
**Problema**: Service Account no puede invitar
**Solución**: Ignorar este error, el email se envía por separado

---

## **🎉 ¡Éxito Total!**

Si todo funciona correctamente, tienes:

### **✅ Sistema Completo:**
- 🔸 **Google Calendar** sincronizado automáticamente
- 🔸 **Google Meet** creado automáticamente para online
- 🔸 **Emails profesionales** enviados automáticamente
- 🔸 **Enlaces de calendario** para pacientes
- 🔸 **Manejo de errores** robusto

### **✅ Experiencia del Psicólogo:**
- 📅 Ve todas las citas en su Google Calendar
- 🎥 Botón Meet automático para consultas online
- 📱 Notificaciones móviles de Google Calendar
- 💼 Información completa del paciente en cada evento

### **✅ Experiencia del Paciente:**
- 📧 Email profesional de confirmación
- 📅 Enlaces para agregar a su calendario personal
- 🎥 Acceso directo a Google Meet para online
- 📱 Recordatorios automáticos

**¡Tu sistema está 100% funcional para producción!** 🚀 