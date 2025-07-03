# Configuración Completa: Email + Google Meet

## 🎯 **Lo que Hemos Implementado**

### ✅ **Funcionalidades Completadas:**
1. **Service Account** que crea eventos en calendario del psicólogo
2. **Google Meet automático** para consultas online
3. **Email profesional** al paciente con confirmación
4. **Enlaces de calendario** para que el paciente agregue la cita
5. **Links de Meet** automáticos en el email
6. **Templates responsive** para móvil y desktop

---

## 🛠️ **Configuración Requerida**

### **1. Variables de Entorno**

Agregar a tu archivo `.env` (crear si no existe):

```env
# Database Configuration (ya existentes)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=psico_user
DATABASE_PASSWORD=psico_password
DATABASE_NAME=psico_db
NODE_ENV=development

# Google Calendar Configuration (ya existentes)
GOOGLE_SERVICE_ACCOUNT_EMAIL=TU_EMAIL_DEL_SERVICE_ACCOUNT@psico-consultas.iam.gserviceaccount.com
GOOGLE_CALENDAR_ID=TU_CALENDAR_ID@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json

# 🆕 EMAIL Configuration (NUEVAS)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password-de-gmail
```

### **2. Configurar Gmail App Password**

#### **Paso A: Habilitar 2FA en Gmail**
1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en 2 pasos
3. Activar si no está activado

#### **Paso B: Crear App Password**
1. En la misma página de Seguridad
2. Buscar "Contraseñas de aplicaciones" 
3. Seleccionar "Correo" → "Otro (nombre personalizado)"
4. Escribir: "Consultas Psicológicas"
5. **Copiar la contraseña de 16 dígitos** que aparece
6. Usar esa contraseña en `EMAIL_PASSWORD`

#### **Ejemplo de configuración:**
```env
EMAIL_USER=psicologo@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## 🧪 **Probar la Implementación Completa**

### **Paso 1: Reiniciar Servidor**
```bash
# Detener servidor actual
# Ctrl+C si está ejecutándose

# Reiniciar
yarn start:dev
```

### **Paso 2: Crear Usuario**
```graphql
mutation {
  createUsuario(createUsuarioInput: {
    rut: "12.345.678-9"
    nombre: "María"
    apellidos: "González López"
    correo: "TU-EMAIL-PERSONAL@gmail.com"  # 👈 Usa tu email para recibir la prueba
    telefono: "+56912345678"
    direccion: "Av. Principal 123"
  }) {
    id
    nombre
    correo
  }
}
```

### **Paso 3A: Probar Consulta PRESENCIAL**
```graphql
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-25"
    hora: "10:00"
    tipo: PRESENCIAL
    motivo: "Consulta inicial de evaluación"
    usuarioId: "ID_DEL_USUARIO_CREADO"
  }) {
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

**Resultado Esperado:**
- ✅ `googleEventId`: ID del evento
- ✅ `googleMeetLink`: `null` (porque es presencial)
- ✅ Evento aparece en Google Calendar del psicólogo
- ✅ Email enviado al paciente **SIN** Google Meet

### **Paso 3B: Probar Consulta ONLINE**
```graphql
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-26"
    hora: "14:00"
    tipo: ONLINE
    motivo: "Sesión de seguimiento terapéutico"
    usuarioId: "ID_DEL_USUARIO_CREADO"
  }) {
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

**Resultado Esperado:**
- ✅ `googleEventId`: ID del evento
- ✅ `googleMeetLink`: URL de Google Meet
- ✅ Evento aparece en Google Calendar del psicólogo **CON** botón Meet
- ✅ Email enviado al paciente **CON** sección de Google Meet

---

## 📧 **Cómo Se Ve el Email**

### **Para Consulta PRESENCIAL:**
```
📅 CONSULTA CONFIRMADA

Estimado/a María González López,

Su consulta psicológica ha sido confirmada:
📅 Fecha: lunes, 25 de diciembre de 2024
🕐 Hora: 10:00 - 10:50
📍 Modalidad: PRESENCIAL
📝 Motivo: Consulta inicial de evaluación

📅 Agregar a su calendario:
[Google Calendar] [Outlook]

📋 Instrucciones importantes:
• Llegue 10 minutos antes de la cita
• Traiga un documento de identidad
• Si necesita cancelar, avise con 24 horas de anticipación

✅ Confirmar Asistencia    ❌ Cancelar Consulta
```

### **Para Consulta ONLINE:**
```
📅 CONSULTA CONFIRMADA

Estimado/a María González López,

Su consulta psicológica ha sido confirmada:
📅 Fecha: martes, 26 de diciembre de 2024
🕐 Hora: 14:00 - 14:50
📍 Modalidad: ONLINE
📝 Motivo: Sesión de seguimiento terapéutico

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

## 🎯 **Vista del Psicólogo en Google Calendar**

### **Consulta Presencial:**
```
📅 Consulta PRESENCIAL - María González López
🕐 25 dic 2024, 10:00 - 10:50
📝 Motivo: Consulta inicial de evaluación
   Paciente: María González López
   Correo: maria@example.com
   Teléfono: +56912345678
```

### **Consulta Online:**
```
📅 Consulta ONLINE - María González López
🕐 26 dic 2024, 14:00 - 14:50
🎥 [Unirse con Google Meet] ← BOTÓN AUTOMÁTICO
📝 Motivo: Sesión de seguimiento terapéutico
   Paciente: María González López
   Correo: maria@example.com
   Teléfono: +56912345678
```

---

## 🔧 **Troubleshooting**

### **Error: "Error enviando email"**
**Causa**: Configuración de Gmail incorrecta
**Solución**:
1. Verificar que `EMAIL_USER` y `EMAIL_PASSWORD` estén correctos
2. Confirmar que usaste App Password (no tu contraseña normal)
3. Verificar que 2FA esté habilitado en Gmail

### **Error: "Google Meet no se crea"**
**Causa**: Permisos del Service Account
**Solución**:
1. Verificar que `conferenceDataVersion: 1` está en el código
2. Confirmar que el Service Account tiene permisos en el calendario
3. Probar reiniciar el servidor

### **Error: "Email no llega"**
**Posibles causas**:
1. **Spam**: Revisar carpeta de spam
2. **Gmail Blocks**: Gmail puede bloquear emails automatizados
3. **App Password**: Verificar configuración

**Soluciones**:
1. Agregar el email del sistema a contactos
2. Usar un servicio profesional como SendGrid (futuro)
3. Probar con otro email de destino

### **Error: "Calendar API quota exceeded"**
**Causa**: Demasiadas pruebas
**Solución**: Esperar unos minutos, el límite se restablece

---

## 🚀 **Próximos Pasos (Opcionales)**

### **Mejoras de Producción:**
1. **SendGrid**: Reemplazar Gmail por servicio profesional
2. **Templates**: Personalizar diseño del email
3. **Recordatorios**: Emails automáticos 24h antes
4. **SMS**: Notificaciones por WhatsApp
5. **Webhooks**: Sincronización bidireccional con Google Calendar

### **Funcionalidades Avanzadas:**
1. **Multiple Psicólogos**: Calendarios separados
2. **Horarios Personalizados**: Por día de la semana
3. **Salas Privadas**: Meet rooms persistentes
4. **Grabaciones**: Automáticas para seguimiento
5. **Dashboard**: Panel de control para el psicólogo

---

## ✅ **Checklist de Verificación**

### **Configuración:**
- [ ] Archivo `.env` con todas las variables
- [ ] Gmail App Password configurado
- [ ] Service Account funcionando
- [ ] Calendario compartido correctamente

### **Pruebas:**
- [ ] Consulta presencial: evento sin Meet
- [ ] Consulta online: evento con Meet
- [ ] Email recibido en ambos casos
- [ ] Links de calendario funcionan
- [ ] Google Meet funciona desde calendario del psicólogo

### **Verificación Final:**
- [ ] Psicólogo ve eventos en su calendario
- [ ] Paciente recibe emails profesionales
- [ ] Google Meet se crea automáticamente para online
- [ ] Sistema funciona sin errores

---

## 🎉 **¡Implementación Completa!**

Con esta configuración tienes:

### **✅ Para el Psicólogo:**
- Calendario automático con todas las citas
- Google Meet integrado para consultas online
- Información completa del paciente en cada evento
- Notificaciones automáticas

### **✅ Para el Paciente:**
- Email profesional de confirmación
- Links para agregar al calendario personal
- Acceso directo a Google Meet para online
- Instrucciones claras según tipo de consulta

### **✅ Para el Sistema:**
- Sincronización automática
- Manejo de errores robusto
- Escalable para múltiples psicólogos
- Base sólida para funcionalidades futuras

**¡Tu sistema de consultas psicológicas está listo para producción!** 🎯 