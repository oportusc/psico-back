# Guía de Pruebas - Integración Google Calendar

## 🎯 Funcionalidades Implementadas

### ✅ **Completadas**
1. **Creación automática de eventos** cuando se crea una consulta
2. **Actualización automática de eventos** cuando se modifica una consulta
3. **Eliminación automática de eventos** cuando se elimina una consulta
4. **Consulta de horarios disponibles** basada en Google Calendar
5. **Sincronización bidireccional** entre tu sistema y Google Calendar

## 🧪 **Pruebas a Realizar**

### **1. Probar Conexión con Google Calendar**
```graphql
query {
  testCalendarConnection
}
```
**Resultado esperado:** `true`

### **2. Crear Usuario de Prueba**
```graphql
mutation {
  createUsuario(createUsuarioInput: {
    rut: "12.345.678-9"
    nombre: "Juan"
    apellidos: "Pérez González"
    correo: "juan.perez@example.com"
    telefono: "+56912345678"
    direccion: "Av. Principal 123"
  }) {
    id
    nombre
    apellidos
    correo
  }
}
```
**Guarda el ID del usuario creado**

### **3. Verificar Horarios Disponibles**
```graphql
query {
  horariosDisponibles(
    fecha: "2024-12-20"
    horaInicio: "09:00"
    horaFin: "18:00"
  )
}
```
**Resultado esperado:** Array de horarios disponibles (ej: ["09:00", "09:50", "10:40", ...])

### **4. Crear Consulta (¡Automáticamente crea evento en Google Calendar!)**
```graphql
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-20"
    hora: "10:00"
    tipo: PRESENCIAL
    motivo: "Consulta inicial por ansiedad"
    usuarioId: "ID_DEL_USUARIO_CREADO"
  }) {
    id
    fecha
    hora
    tipo
    motivo
    confirmada
    cancelada
    googleEventId
    usuario {
      nombre
      apellidos
      correo
    }
  }
}
```
**Verificar:**
- ✅ Consulta creada en tu sistema
- ✅ Evento automáticamente creado en Google Calendar
- ✅ Campo `googleEventId` contiene el ID del evento
- ✅ Notificación por email al psicólogo y paciente

### **5. Verificar Horarios Disponibles Actualizado**
```graphql
query {
  horariosDisponibles(
    fecha: "2024-12-20"
    horaInicio: "09:00"
    horaFin: "18:00"
  )
}
```
**Resultado esperado:** El horario "10:00" ya NO aparece en la lista

### **6. Actualizar Consulta (¡Automáticamente actualiza evento!)**
```graphql
mutation {
  updateConsulta(
    id: "ID_DE_LA_CONSULTA"
    updateConsultaInput: {
      hora: "11:00"
      motivo: "Consulta inicial por ansiedad - Reagendada"
    }
  ) {
    id
    fecha
    hora
    motivo
    googleEventId
  }
}
```
**Verificar:**
- ✅ Consulta actualizada en tu sistema
- ✅ Evento automáticamente actualizado en Google Calendar
- ✅ Nueva hora reflejada en el calendario

### **7. Eliminar Consulta (¡Automáticamente elimina evento!)**
```graphql
mutation {
  removeConsulta(id: "ID_DE_LA_CONSULTA") {
    id
    googleEventId
  }
}
```
**Verificar:**
- ✅ Consulta eliminada de tu sistema
- ✅ Evento automáticamente eliminado de Google Calendar

## 📱 **Verificaciones en Google Calendar**

### **Para el Psicólogo:**
1. Abrir Google Calendar en web o móvil
2. Verificar que los eventos aparecen automáticamente
3. Confirmar que recibe notificaciones por email
4. Verificar que los eventos se actualizan/eliminan automáticamente

### **Para el Paciente:**
1. Verificar que recibe invitación por email
2. Confirmar que puede aceptar/rechazar la invitación
3. Verificar recordatorios automáticos

## 🔧 **Flujo de Trabajo Real**

### **Escenario: Paciente agenda cita**
1. **Frontend** consulta horarios disponibles: `horariosDisponibles`
2. **Paciente** selecciona horario y llena formulario
3. **Sistema** crea consulta con `createConsulta`
4. **Automáticamente** se crea evento en Google Calendar
5. **Psicólogo** recibe notificación y ve la cita en su calendario
6. **Paciente** recibe confirmación por email

### **Escenario: Modificación de cita**
1. **Admin/Psicólogo** modifica la cita en el sistema
2. **Automáticamente** se actualiza en Google Calendar
3. **Ambos** reciben notificación del cambio

### **Escenario: Cancelación**
1. **Admin/Psicólogo** cancela la cita
2. **Automáticamente** se elimina de Google Calendar
3. **Ambos** reciben notificación de cancelación

## 🎉 **Beneficios Logrados**

### **Para el Psicólogo:**
- ✅ Ve todas las citas en su calendario personal
- ✅ Recibe notificaciones automáticas
- ✅ Sincronización en tiempo real
- ✅ No necesita gestionar dos sistemas

### **Para el Paciente:**
- ✅ Recibe invitaciones automáticas
- ✅ Recordatorios nativos del calendario
- ✅ Puede aceptar/rechazar invitaciones

### **Para el Sistema:**
- ✅ Sincronización automática bidireccional
- ✅ Backup en Google Calendar
- ✅ Gestión de disponibilidad en tiempo real
- ✅ Infraestructura confiable de Google

## 🚀 **Próximos Pasos Opcionales**

### **Para Mejorar Aún Más:**
1. **Webhooks**: Sincronización cuando el psicólogo modifica desde Google Calendar
2. **Múltiples Psicólogos**: Calendarios separados por profesional
3. **Configuración de Horarios**: Horarios específicos por día/psicólogo
4. **Recordatorios Personalizados**: Diferentes tipos de notificaciones
5. **Integración con Video**: Links automáticos para consultas online

## 💡 **Troubleshooting**

### **Si no funciona la conexión:**
1. Verificar que el archivo `google-service-account.json` esté en la raíz
2. Confirmar que las variables de entorno estén correctas
3. Verificar que el calendario esté compartido con el Service Account
4. Revisar logs del servidor para errores específicos

### **Si no aparecen eventos en Google Calendar:**
1. Verificar que el Calendar ID sea correcto
2. Confirmar permisos del Service Account
3. Verificar zona horaria (debe ser America/Santiago)
4. Revisar que la fecha no sea en el pasado 