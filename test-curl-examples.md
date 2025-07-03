# Ejemplos de cURL para API de Consultas Psicológicas

## Configuración
- URL Base: `http://localhost:3000/graphql`
- Content-Type: `application/json`

## 1. Crear Usuario

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateUsuario($createUsuarioInput: CreateUsuarioInput!) { createUsuario(createUsuarioInput: $createUsuarioInput) { id rut nombre apellidos correo telefono direccion createdAt } }",
    "variables": {
      "createUsuarioInput": {
        "rut": "12.345.678-9",
        "nombre": "Juan",
        "apellidos": "Pérez González",
        "correo": "juan.perez@email.com",
        "telefono": "+56912345678",
        "direccion": "Av. Providencia 123, Santiago"
      }
    }
  }'
```

## 2. Obtener Todos los Usuarios

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { usuarios { id rut nombre apellidos correo telefono direccion createdAt } }"
  }'
```

## 3. Obtener Usuario por ID

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUsuario($id: String!) { usuario(id: $id) { id rut nombre apellidos correo telefono direccion consultas { id fecha hora tipo motivo } } }",
    "variables": {
      "id": "USER_ID_HERE"
    }
  }'
```

## 4. Obtener Usuario por RUT

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUsuarioByRut($rut: String!) { usuarioByRut(rut: $rut) { id rut nombre apellidos correo telefono direccion } }",
    "variables": {
      "rut": "12.345.678-9"
    }
  }'
```

## 5. Actualizar Usuario

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation UpdateUsuario($id: String!, $updateUsuarioInput: UpdateUsuarioInput!) { updateUsuario(id: $id, updateUsuarioInput: $updateUsuarioInput) { id rut nombre apellidos correo telefono direccion } }",
    "variables": {
      "id": "USER_ID_HERE",
      "updateUsuarioInput": {
        "telefono": "+56987654321",
        "direccion": "Nueva dirección 456, Santiago"
      }
    }
  }'
```

## 6. Crear Consulta

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateConsulta($createConsultaInput: CreateConsultaInput!) { createConsulta(createConsultaInput: $createConsultaInput) { id fecha hora tipo motivo confirmada cancelada usuario { id nombre apellidos } } }",
    "variables": {
      "createConsultaInput": {
        "fecha": "2024-02-15",
        "hora": "14:30",
        "tipo": "PRESENCIAL",
        "motivo": "Primera consulta para evaluación psicológica",
        "usuarioId": "USER_ID_HERE"
      }
    }
  }'
```

## 7. Obtener Todas las Consultas

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { consultas { id fecha hora tipo motivo confirmada cancelada usuario { id nombre apellidos } } }"
  }'
```

## 8. Obtener Consulta por ID

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetConsulta($id: String!) { consulta(id: $id) { id fecha hora tipo motivo confirmada cancelada usuario { id nombre apellidos correo telefono } } }",
    "variables": {
      "id": "CONSULTA_ID_HERE"
    }
  }'
```

## 9. Obtener Consultas de un Usuario

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetConsultasByUsuario($usuarioId: String!) { consultasByUsuario(usuarioId: $usuarioId) { id fecha hora tipo motivo confirmada cancelada } }",
    "variables": {
      "usuarioId": "USER_ID_HERE"
    }
  }'
```

## 10. Obtener Consultas Próximas

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { consultasProximas { id fecha hora tipo motivo confirmada usuario { nombre apellidos } } }"
  }'
```

## 11. Obtener Consultas Pasadas

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { consultasPasadas { id fecha hora tipo motivo confirmada usuario { nombre apellidos } } }"
  }'
```

## 12. Confirmar Consulta

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ConfirmarConsulta($id: String!) { confirmarConsulta(id: $id) { id confirmada } }",
    "variables": {
      "id": "CONSULTA_ID_HERE"
    }
  }'
```

## 13. Cancelar Consulta

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CancelarConsulta($id: String!) { cancelarConsulta(id: $id) { id cancelada } }",
    "variables": {
      "id": "CONSULTA_ID_HERE"
    }
  }'
```

## 14. Actualizar Consulta

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation UpdateConsulta($id: String!, $updateConsultaInput: UpdateConsultaInput!) { updateConsulta(id: $id, updateConsultaInput: $updateConsultaInput) { id fecha hora tipo motivo } }",
    "variables": {
      "id": "CONSULTA_ID_HERE",
      "updateConsultaInput": {
        "hora": "15:00",
        "tipo": "ONLINE"
      }
    }
  }'
```

## 15. Eliminar Usuario

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation RemoveUsuario($id: String!) { removeUsuario(id: $id) { id rut nombre } }",
    "variables": {
      "id": "USER_ID_HERE"
    }
  }'
```

## 16. Eliminar Consulta

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation RemoveConsulta($id: String!) { removeConsulta(id: $id) { id fecha hora } }",
    "variables": {
      "id": "CONSULTA_ID_HERE"
    }
  }'
```

## Notas Importantes:

1. **Reemplazar IDs**: En los ejemplos donde aparece `USER_ID_HERE` o `CONSULTA_ID_HERE`, debes reemplazarlos con los IDs reales obtenidos de las operaciones anteriores.

2. **Formato de Fecha**: Las fechas deben estar en formato `YYYY-MM-DD`.

3. **Formato de Hora**: Las horas deben estar en formato `HH:MM` (24 horas).

4. **Tipos de Consulta**: Los valores válidos son `ONLINE` o `PRESENCIAL`.

5. **Validaciones**: 
   - El RUT debe tener formato `XX.XXX.XXX-X`
   - El correo debe ser válido
   - El teléfono debe tener formato internacional
   - No se pueden crear consultas en fechas pasadas
   - No puede haber dos consultas en la misma fecha y hora

6. **Relaciones**: Al eliminar un usuario, se eliminan automáticamente todas sus consultas (cascade delete).

## Flujo Típico de Uso:

1. Crear usuario
2. Crear consulta asociada al usuario
3. Confirmar consulta
4. Consultar información de consultas
5. Actualizar o cancelar según sea necesario 