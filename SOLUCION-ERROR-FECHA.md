# Solución al Error de Fecha en GraphQL

## 🔧 **Cambios Realizados**

### **Problema Original**
```
Error: Expected `DateTime.serialize("2025-07-19")` to return non-nullable value, returned: null
```

### **Causa**
El campo `fecha` estaba definido como `type: 'date'` en PostgreSQL, que solo almacena la fecha sin hora, causando problemas de serialización con GraphQL DateTime.

### **Solución Implementada**
1. **Cambio en la entidad**: `type: 'date'` → `type: 'timestamp'`
2. **Normalización de fechas**: Se asegura que todas las fechas se manejen correctamente
3. **Mejoras en validaciones**: Comparaciones de fecha más precisas

## 🚨 **Acción Requerida**

### **Si tienes datos existentes en la base de datos:**

#### **Opción 1: Recrear Base de Datos (Recomendada para desarrollo)**
```bash
# Detener el servidor
# Eliminar y recrear la base de datos
docker-compose down
docker-compose up -d postgres
# Reiniciar el servidor
yarn start:dev
```

#### **Opción 2: Migración Manual**
```sql
-- Conectar a la base de datos y ejecutar:
ALTER TABLE consulta ALTER COLUMN fecha TYPE timestamp;
```

### **Si es una instalación nueva:**
No necesitas hacer nada adicional, los cambios se aplicarán automáticamente.

## 🧪 **Probar la Solución**

### **1. Crear Usuario de Prueba**
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

### **2. Crear Consulta con Fecha Futura**
```graphql
mutation {
  createConsulta(createConsultaInput: {
    fecha: "2024-12-25"
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

### **Resultado Esperado**
```json
{
  "data": {
    "createConsulta": {
      "id": "uuid-generado",
      "fecha": "2024-12-25T00:00:00.000Z",
      "hora": "10:00",
      "tipo": "PRESENCIAL",
      "motivo": "Consulta inicial por ansiedad",
      "confirmada": false,
      "cancelada": false,
      "googleEventId": "evento-id-google",
      "usuario": {
        "nombre": "Juan",
        "apellidos": "Pérez González",
        "correo": "juan.perez@example.com"
      }
    }
  }
}
```

## ✅ **Verificaciones Adicionales**

### **1. Probar Horarios Disponibles**
```graphql
query {
  horariosDisponibles(
    fecha: "2024-12-25"
    horaInicio: "09:00"
    horaFin: "18:00"
  )
}
```

### **2. Verificar en Google Calendar**
- Abrir Google Calendar
- Buscar el evento creado
- Verificar que la fecha y hora sean correctas

### **3. Probar Actualización**
```graphql
mutation {
  updateConsulta(
    id: "ID_DE_LA_CONSULTA"
    updateConsultaInput: {
      fecha: "2024-12-26"
      hora: "11:00"
    }
  ) {
    id
    fecha
    hora
    googleEventId
  }
}
```

## 🔍 **Troubleshooting**

### **Error: "relation does not exist"**
**Solución**: Recrear la base de datos siguiendo la Opción 1

### **Error: "column cannot be cast automatically"**
**Solución**: Usar la migración manual (Opción 2)

### **Error: "Google Calendar Event not created"**
**Solución**: Verificar:
- Variables de entorno correctas
- Archivo `google-service-account.json` en raíz
- Calendario compartido con Service Account
- Conexión a internet

### **Error: "DateTime serialization"**
**Solución**: 
1. Verificar que el servidor se reinició después de los cambios
2. Limpiar caché del navegador
3. Probar con fechas futuras únicamente

## 📋 **Resumen de Mejoras**

### **Antes**
- ❌ Campo `fecha` como `type: 'date'`
- ❌ Problemas de serialización DateTime
- ❌ Comparaciones de fecha inconsistentes

### **Después**
- ✅ Campo `fecha` como `type: 'timestamp'`
- ✅ Serialización DateTime correcta
- ✅ Fechas normalizadas para comparaciones
- ✅ Integración Google Calendar funcional
- ✅ Validaciones de fecha mejoradas

## 🎯 **Resultado Final**

Con estos cambios, ahora puedes:
1. ✅ Crear consultas sin errores de fecha
2. ✅ Ver fechas correctamente en GraphQL
3. ✅ Sincronizar automáticamente con Google Calendar
4. ✅ Obtener horarios disponibles en tiempo real
5. ✅ Actualizar/eliminar consultas sin problemas 