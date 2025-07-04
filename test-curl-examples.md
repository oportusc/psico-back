# cURL Examples for Psychological Appointments API

## Configuration
- Base URL: `http://localhost:3000/graphql`
- Content-Type: `application/json`

## 1. Create User

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateUser($createUserInput: CreateUserInput!) { createUser(createUserInput: $createUserInput) { id rut firstName lastName email phone address createdAt } }",
    "variables": {
      "createUserInput": {
        "rut": "12.345.678-9",
        "firstName": "Juan",
        "lastName": "Pérez González",
        "email": "juan.perez@email.com",
        "phone": "+56912345678",
        "address": "Av. Providencia 123, Santiago"
      }
    }
  }'
```

## 2. Get All Users

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id rut firstName lastName email phone address createdAt } }"
  }'
```

## 3. Get User by ID

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUser($id: String!) { user(id: $id) { id rut firstName lastName email phone address appointments { id date time type reason } } }",
    "variables": {
      "id": "USER_ID_HERE"
    }
  }'
```

## 4. Get User by RUT

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUserByRut($rut: String!) { userByRut(rut: $rut) { id rut firstName lastName email phone address } }",
    "variables": {
      "rut": "12.345.678-9"
    }
  }'
```

## 5. Update User

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) { updateUser(id: $id, updateUserInput: $updateUserInput) { id rut firstName lastName email phone address } }",
    "variables": {
      "id": "USER_ID_HERE",
      "updateUserInput": {
        "phone": "+56987654321",
        "address": "Nueva dirección 456, Santiago"
      }
    }
  }'
```

## 6. Create Appointment

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateAppointment($createAppointmentInput: CreateAppointmentInput!) { createAppointment(createAppointmentInput: $createAppointmentInput) { id date time type reason confirmed cancelled user { id firstName lastName } } }",
    "variables": {
      "createAppointmentInput": {
        "date": "2024-02-15",
        "time": "14:30",
        "type": "IN_PERSON",
        "reason": "First appointment for psychological evaluation",
        "userId": "USER_ID_HERE"
      }
    }
  }'
```

## 7. Get All Appointments

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { appointments { id date time type reason confirmed cancelled user { id firstName lastName } } }"
  }'
```

## 8. Get Appointment by ID

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetAppointment($id: String!) { appointment(id: $id) { id date time type reason confirmed cancelled user { id firstName lastName email phone } } }",
    "variables": {
      "id": "APPOINTMENT_ID_HERE"
    }
  }'
```

## 9. Get Appointments by User

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetAppointmentsByUser($userId: String!) { appointmentsByUser(userId: $userId) { id date time type reason confirmed cancelled } }",
    "variables": {
      "userId": "USER_ID_HERE"
    }
  }'
```

## 10. Get Upcoming Appointments

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { upcomingAppointments { id date time type reason confirmed user { firstName lastName } } }"
  }'
```

## 11. Get Past Appointments

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { pastAppointments { id date time type reason confirmed user { firstName lastName } } }"
  }'
```

## 12. Confirm Appointment

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ConfirmAppointment($id: String!) { confirmAppointment(id: $id) { id confirmed } }",
    "variables": {
      "id": "APPOINTMENT_ID_HERE"
    }
  }'
```

## 13. Cancel Appointment

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CancelAppointment($id: String!) { cancelAppointment(id: $id) { id cancelled } }",
    "variables": {
      "id": "APPOINTMENT_ID_HERE"
    }
  }'
```

## 14. Update Appointment

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation UpdateAppointment($id: String!, $updateAppointmentInput: UpdateAppointmentInput!) { updateAppointment(id: $id, updateAppointmentInput: $updateAppointmentInput) { id date time type reason } }",
    "variables": {
      "id": "APPOINTMENT_ID_HERE",
      "updateAppointmentInput": {
        "time": "15:00",
        "type": "ONLINE"
      }
    }
  }'
```

## 15. Create Psychologist

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreatePsychologist($createPsychologistInput: CreatePsychologistInput!) { createPsychologist(createPsychologistInput: $createPsychologistInput) { id firstName lastName email phone specialty active } }",
    "variables": {
      "createPsychologistInput": {
        "firstName": "Dr. Ana",
        "lastName": "María Silva",
        "email": "ana.silva@clinic.com",
        "phone": "+56987654321",
        "specialty": "Clinical Psychology",
        "googleCalendarId": "calendar-id-here",
        "active": true
      }
    }
  }'
```

## 16. Get All Psychologists

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { psychologists { id firstName lastName email phone specialty active appointments { id date time type reason } } }"
  }'
```

## 17. Delete User

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation RemoveUser($id: String!) { removeUser(id: $id) { id firstName lastName } }",
    "variables": {
      "id": "USER_ID_HERE"
    }
  }'
```

## 18. Delete Appointment

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation RemoveAppointment($id: String!) { removeAppointment(id: $id) { id } }",
    "variables": {
      "id": "APPOINTMENT_ID_HERE"
    }
  }'
```

## Notas Importantes:

1. **Reemplazar IDs**: En los ejemplos donde aparece `USER_ID_HERE` o `APPOINTMENT_ID_HERE`, debes reemplazarlos con los IDs reales obtenidos de las operaciones anteriores.

2. **Formato de Fecha**: Las fechas deben estar en formato `YYYY-MM-DD`.

3. **Formato de Hora**: Las horas deben estar en formato `HH:MM` (24 horas).

4. **Tipos de Consulta**: Los valores válidos son `IN_PERSON` o `ONLINE`.

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