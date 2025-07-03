# 🧠 Sistema Multi-Psicólogo: Guía de Pruebas Completa

## **🎯 Lo que Hemos Implementado**

### ✅ **Sistema Multi-Psicólogo Completo:**
1. **Entidad Psicólogo** con calendarios separados
2. **Consultas por psicólogo** con privacidad total  
3. **Google Calendar individual** por cada psicólogo
4. **Google Meet automático** por psicólogo
5. **Emails personalizados** con información del psicólogo
6. **Queries específicas** por psicólogo

---

## **🔧 Configuración Inicial**

### **Paso 1: Crear Calendarios en Google Calendar**

Para cada psicólogo necesitas:

1. **Crear calendario individual** en Google Calendar:
   - Ir a Google Calendar → "+" → "Crear nuevo calendario"
   - Nombre: "Consultas Dr. Juanito", "Consultas Dra. Paz", etc.
   - Descripción: "Calendario de consultas psicológicas"

2. **Compartir con Service Account**:
   - Ir a Configuración → "Compartir con personas específicas"
   - Agregar: `tu-service-account@psico-consultas.iam.gserviceaccount.com`
   - Permisos: "Realizar cambios en eventos"

3. **Obtener Calendar ID**:
   - Ir a Configuración del calendario → "Integrar calendario"
   - Copiar "ID del calendario": algo como `abc123@group.calendar.google.com`

### **Paso 2: Reiniciar Servidor**
```bash
yarn start:dev
```

---

## **🧪 Pruebas Paso a Paso**

### **🔹 Paso 1: Crear Psicólogos**

#### **Crear Dr. Juanito:**
```graphql
mutation {
  createPsicologo(createPsicologoInput: {
    nombre: "Juan Carlos"
    apellidos: "García López"
    email: "juanito@clinica.com"
    telefono: "+56912345678"
    especialidad: "Psicología Clínica"
    descripcion: "Especialista en terapia cognitivo-conductual con 10 años de experiencia"
    googleCalendarId: "CALENDAR_ID_DE_JUANITO@group.calendar.google.com"
    colorCalendario: "#4285F4"
  }) {
    id
    nombre
    apellidos
    email
    especialidad
    googleCalendarId
    activo
    nombreCompleto
  }
}
```

#### **Crear Dra. Paz:**
```graphql
mutation {
  createPsicologo(createPsicologoInput: {
    nombre: "María Paz"
    apellidos: "Rodríguez Silva"
    email: "paz@clinica.com"
    telefono: "+56987654321"
    especialidad: "Psicología Infantil"
    descripcion: "Especialista en terapia infantil y adolescente con enfoque sistémico"
    googleCalendarId: "CALENDAR_ID_DE_PAZ@group.calendar.google.com"
    colorCalendario: "#DB4437"
  }) {
    id
    nombre
    apellidos
    email
    especialidad
    googleCalendarId
    activo
    nombreCompleto
  }
}
```

#### **Crear Dr. Carlos:**
```graphql
mutation {
  createPsicologo(createPsicologoInput: {
    nombre: "Carlos"
    apellidos: "Mendoza Torres"
    email: "carlos@clinica.com"
    telefono: "+56945678901"
    especialidad: "Psicología de Parejas"
    descripcion: "Especialista en terapia de parejas y familiar con enfoque humanista"
    googleCalendarId: "CALENDAR_ID_DE_CARLOS@group.calendar.google.com"
    colorCalendario: "#0F9D58"
  }) {
    id
    nombre
    apellidos
    email
    especialidad
    googleCalendarId
    activo
    nombreCompleto
  }
}
```

### **🔹 Paso 2: Verificar Psicólogos Creados**

```graphql
query {
  psicologos {
    id
    nombre
    apellidos
    email
    especialidad
    googleCalendarId
    activo
    nombreCompleto
    consultasCount
  }
}
```

**Resultado esperado:**
```json
{
  "data": {
    "psicologos": [
      {
        "id": "uuid-juanito",
        "nombre": "Juan Carlos",
        "apellidos": "García López",
        "email": "juanito@clinica.com",
        "especialidad": "Psicología Clínica",
        "googleCalendarId": "calendar-id-juanito@group.calendar.google.com",
        "activo": true,
        "nombreCompleto": "Juan Carlos García López",
        "consultasCount": 0
      },
      // ... otros psicólogos
    ]
  }
}
```

### **🔹 Paso 3: Crear Usuario de Prueba**

```graphql
mutation {
  createUsuario(createUsuarioInput: {
    rut: "12.345.678-9"
    nombre: "Ana"
    apellidos: "Martínez González"
    correo: "tu-email-personal@gmail.com"  # 👈 Tu email para recibir pruebas
    telefono: "+56923456789"
    direccion: "Av. Providencia 123, Santiago"
  }) {
    id
    nombre
    apellidos
    correo
    rut
  }
}
```

### **🔹 Paso 4: Probar Consultas por Psicólogo**

#### **Consulta PRESENCIAL con Dr. Juanito:**
```graphql
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-25"
    hora: "10:00"
    tipo: PRESENCIAL
    motivo: "Evaluación inicial - Ansiedad y estrés laboral"
    usuarioId: "ID_DEL_USUARIO"
    psicologoId: "ID_DE_JUANITO"
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
      apellidos
      correo
    }
    psicologo {
      nombre
      apellidos
      email
      especialidad
    }
  }
}
```

#### **Consulta ONLINE con Dra. Paz:**
```graphql
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-26"
    hora: "14:00"
    tipo: ONLINE
    motivo: "Consulta de seguimiento - Terapia infantil"
    usuarioId: "ID_DEL_USUARIO"
    psicologoId: "ID_DE_PAZ"
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
      apellidos
      correo
    }
    psicologo {
      nombre
      apellidos
      email
      especialidad
    }
  }
}
```

#### **Consulta ONLINE con Dr. Carlos:**
```graphql
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-27"
    hora: "16:30"
    tipo: ONLINE
    motivo: "Terapia de pareja - Primera sesión"
    usuarioId: "ID_DEL_USUARIO"
    psicologoId: "ID_DE_CARLOS"
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
      apellidos
      correo
    }
    psicologo {
      nombre
      apellidos
      email
      especialidad
    }
  }
}
```

### **🔹 Paso 5: Verificar Separación de Calendarios**

#### **Consultas de Dr. Juanito:**
```graphql
query {
  consultasByPsicologo(psicologoId: "ID_DE_JUANITO") {
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
    }
    psicologo {
      nombre
      apellidos
    }
  }
}
```

#### **Consultas de Dra. Paz:**
```graphql
query {
  consultasByPsicologo(psicologoId: "ID_DE_PAZ") {
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
    }
    psicologo {
      nombre
      apellidos
    }
  }
}
```

### **🔹 Paso 6: Verificar Próximas Consultas por Psicólogo**

```graphql
query {
  consultasProximasByPsicologo(psicologoId: "ID_DE_JUANITO") {
    id
    fecha
    hora
    tipo
    motivo
    usuario {
      nombre
      apellidos
    }
    psicologo {
      nombre
      apellidos
    }
  }
}
```

---

## **🎯 Verificaciones de Funcionamiento**

### **✅ En Google Calendar:**

#### **Dr. Juanito debería ver:**
```
📅 Calendario: "Consultas Dr. Juanito"
🕐 25 dic 2024, 10:00 - 10:50
📝 Consulta PRESENCIAL - Ana Martínez González
   Motivo: Evaluación inicial - Ansiedad y estrés laboral
   Paciente: Ana Martínez González
   Correo: tu-email-personal@gmail.com
   Psicólogo: Juan Carlos García López
```

#### **Dra. Paz debería ver:**
```
📅 Calendario: "Consultas Dra. Paz"  
🕐 26 dic 2024, 14:00 - 14:50
🎥 [Unirse con Google Meet] ← BOTÓN AUTOMÁTICO
📝 Consulta ONLINE - Ana Martínez González
   Motivo: Consulta de seguimiento - Terapia infantil
   Paciente: Ana Martínez González
   Correo: tu-email-personal@gmail.com
   Psicólogo: María Paz Rodríguez Silva
```

#### **Dr. Carlos debería ver:**
```
📅 Calendario: "Consultas Dr. Carlos"
🕐 27 dic 2024, 16:30 - 17:20
🎥 [Unirse con Google Meet] ← BOTÓN AUTOMÁTICO
📝 Consulta ONLINE - Ana Martínez González
   Motivo: Terapia de pareja - Primera sesión
   Paciente: Ana Martínez González
   Correo: tu-email-personal@gmail.com
   Psicólogo: Carlos Mendoza Torres
```

### **✅ En Emails del Paciente:**

#### **Email para consulta con Dr. Juanito:**
```
📅 CONSULTA CONFIRMADA

Estimado/a Ana Martínez González,

Su consulta psicológica ha sido confirmada:
📅 Fecha: martes, 25 de diciembre de 2024
🕐 Hora: 10:00 - 10:50
📍 Modalidad: PRESENCIAL
📝 Motivo: Evaluación inicial - Ansiedad y estrés laboral
👨‍⚕️ Psicólogo/a: Juan Carlos García López
🎓 Especialidad: Psicología Clínica

✅ Confirmar Asistencia → juanito@clinica.com
❌ Cancelar Consulta → juanito@clinica.com

Juan Carlos García López
Psicología Clínica
📧 Email: juanito@clinica.com
```

#### **Email para consulta con Dra. Paz:**
```
📅 CONSULTA CONFIRMADA

Estimado/a Ana Martínez González,

Su consulta psicológica ha sido confirmada:
📅 Fecha: miércoles, 26 de diciembre de 2024
🕐 Hora: 14:00 - 14:50
📍 Modalidad: ONLINE
📝 Motivo: Consulta de seguimiento - Terapia infantil
👨‍⚕️ Psicólogo/a: María Paz Rodríguez Silva
🎓 Especialidad: Psicología Infantil

🎥 REUNIÓN ONLINE
[📹 Unirse a Google Meet]

✅ Confirmar Asistencia → paz@clinica.com
❌ Cancelar Consulta → paz@clinica.com

María Paz Rodríguez Silva
Psicología Infantil
📧 Email: paz@clinica.com
```

---

## **🚨 Pruebas de Seguridad y Privacidad**

### **🔸 Test 1: Conflictos de Horarios**

Intentar crear consulta en mismo horario para diferentes psicólogos (debería funcionar):

```graphql
# Esta consulta DEBERÍA funcionar (diferente psicólogo)
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-25"
    hora: "10:00"  # ← Misma hora que Juanito
    tipo: ONLINE
    motivo: "Otra consulta simultánea"
    usuarioId: "ID_DEL_USUARIO"
    psicologoId: "ID_DE_PAZ"  # ← Diferente psicólogo
  }) {
    id
    psicologo {
      nombre
    }
  }
}
```

### **🔸 Test 2: Conflicto con Mismo Psicólogo**

Intentar crear consulta en mismo horario para mismo psicólogo (debería fallar):

```graphql
# Esta consulta DEBERÍA FALLAR (mismo psicólogo, misma hora)
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-25"
    hora: "10:00"  # ← Misma hora
    tipo: PRESENCIAL
    motivo: "Consulta que debería fallar"
    usuarioId: "ID_DEL_USUARIO"
    psicologoId: "ID_DE_JUANITO"  # ← Mismo psicólogo
  }) {
    id
  }
}
```

**Error esperado:**
```json
{
  "errors": [
    {
      "message": "Ya existe una consulta programada para Juan Carlos García López en esta fecha y hora"
    }
  ]
}
```

---

## **📊 Queries de Administración**

### **Ver todas las consultas con psicólogos:**
```graphql
query {
  consultas {
    id
    fecha
    hora
    tipo
    motivo
    usuario {
      nombre
      apellidos
    }
    psicologo {
      nombre
      apellidos
      especialidad
    }
  }
}
```

### **Estadísticas por psicólogo:**
```graphql
query {
  psicologos {
    id
    nombre
    apellidos
    especialidad
    consultasCount
    activo
  }
}
```

---

## **✅ Checklist de Verificación**

### **🔸 Funcionalidad Base:**
- [ ] Crear múltiples psicólogos exitosamente
- [ ] Crear consultas asignadas a psicólogos específicos
- [ ] Verificar que queries por psicólogo funcionan
- [ ] Confirmar que conflictos solo aplican por psicólogo

### **🔸 Google Calendar:**
- [ ] Cada psicólogo ve solo sus citas en su calendario
- [ ] Eventos aparecen en calendario correcto
- [ ] Google Meet funciona para consultas online
- [ ] Información del psicólogo aparece en eventos

### **🔸 Emails:**
- [ ] Paciente recibe email con información correcta del psicólogo
- [ ] Botones de confirmación/cancelación van al email del psicólogo correcto
- [ ] Footer del email muestra información del psicólogo asignado
- [ ] Google Meet aparece solo para consultas online

### **🔸 Privacidad:**
- [ ] Cada psicólogo ve solo sus propias citas
- [ ] Calendarios están separados completamente
- [ ] Google Meet es específico por psicólogo
- [ ] No hay interferencia entre psicólogos

---

## **🎉 ¡Sistema Multi-Psicólogo Funcional!**

Con esta implementación tienes:

### **✅ Para Cada Psicólogo:**
- 📅 **Calendario personal** con solo sus citas
- 🎥 **Google Meet automático** para sus consultas online
- 📧 **Emails personalizados** con su información
- 🔒 **Privacidad total** - no ve citas de otros

### **✅ Para los Pacientes:**
- 📨 **Emails profesionales** con información del psicólogo asignado
- 📅 **Enlaces de calendario** para agregar la cita personal
- 🎥 **Acceso directo a Google Meet** del psicólogo correcto
- 📞 **Contacto directo** con el psicólogo asignado

### **✅ Para el Administrador:**
- 📊 **Vista general** de todas las consultas
- 📈 **Estadísticas por psicólogo**
- 🔧 **Gestión centralizada** de psicólogos
- 🎯 **Escalabilidad** para agregar más profesionales

**¡Tu sistema está listo para una clínica multi-psicólogo en producción!** 🚀 