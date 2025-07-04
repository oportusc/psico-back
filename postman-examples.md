# Postman Examples for Psychological Appointments GraphQL API

## Base Configuration
- **URL:** `http://localhost:3000/graphql`
- **Method:** POST
- **Headers:** 
  - `Content-Type: application/json`

## 1. Create User

**Body (raw JSON):**
```json
{
  "query": "mutation CreateUser($createUserInput: CreateUserInput!) { createUser(createUserInput: $createUserInput) { id rut firstName lastName email phone address createdAt } }",
  "variables": {
    "createUserInput": {
      "rut": "12.345.678-9",
      "firstName": "María",
      "lastName": "González López",
      "email": "maria.gonzalez@email.com",
      "phone": "+56912345678",
      "address": "Av. Providencia 123, Santiago"
    }
  }
}
```

## 2. Get All Users

**Body (raw JSON):**
```json
{
  "query": "query { users { id rut firstName lastName email phone address createdAt } }"
}
```

## 3. Get User by ID

**Body (raw JSON):**
```json
{
  "query": "query GetUser($id: String!) { user(id: $id) { id rut firstName lastName email phone address appointments { id date time type reason } } }",
  "variables": {
    "id": "USER_ID_HERE"
  }
}
```

## 4. Create Psychologist

**Body (raw JSON):**
```json
{
  "query": "mutation CreatePsychologist($createPsychologistInput: CreatePsychologistInput!) { createPsychologist(createPsychologistInput: $createPsychologistInput) { id firstName lastName email phone specialty active googleCalendarId } }",
  "variables": {
    "createPsychologistInput": {
      "firstName": "Dr. Ana",
      "lastName": "Silva Martínez",
      "email": "ana.silva@clinic.com",
      "phone": "+56987654321",
      "specialty": "Clinical Psychology",
      "googleCalendarId": "your-calendar-id@gmail.com",
      "active": true
    }
  }
}
```

## 5. Get All Psychologists

**Body (raw JSON):**
```json
{
  "query": "query { psychologists { id firstName lastName email phone specialty active appointments { id date time type reason } } }"
}
```

## 6. Create Appointment (IN-PERSON)

**Body (raw JSON):**
```json
{
  "query": "mutation CreateAppointment($createAppointmentInput: CreateAppointmentInput!) { createAppointment(createAppointmentInput: $createAppointmentInput) { id date time type reason confirmed cancelled googleEventId googleMeetLink user { id firstName lastName email } psychologist { id firstName lastName email } } }",
  "variables": {
    "createAppointmentInput": {
      "date": "2024-12-25",
      "time": "10:00",
      "type": "IN_PERSON",
      "reason": "Initial psychological evaluation",
      "userId": "USER_ID_HERE",
      "psychologistId": "PSYCHOLOGIST_ID_HERE"
    }
  }
}
```

## 7. Create Appointment (ONLINE)

**Body (raw JSON):**
```json
{
  "query": "mutation CreateAppointment($createAppointmentInput: CreateAppointmentInput!) { createAppointment(createAppointmentInput: $createAppointmentInput) { id date time type reason confirmed cancelled googleEventId googleMeetLink user { id firstName lastName email } psychologist { id firstName lastName email } } }",
  "variables": {
    "createAppointmentInput": {
      "date": "2024-12-26",
      "time": "14:00",
      "type": "ONLINE",
      "reason": "Online therapeutic session",
      "userId": "USER_ID_HERE",
      "psychologistId": "PSYCHOLOGIST_ID_HERE"
    }
  }
}
```

## 8. Get All Appointments

**Body (raw JSON):**
```json
{
  "query": "query { appointments { id date time type reason confirmed cancelled googleEventId googleMeetLink user { id firstName lastName email } psychologist { id firstName lastName email } } }"
}
```

## 9. Get Appointment by ID

**Body (raw JSON):**
```json
{
  "query": "query GetAppointment($id: String!) { appointment(id: $id) { id date time type reason confirmed cancelled googleEventId googleMeetLink user { id firstName lastName email phone } psychologist { id firstName lastName email specialty } } }",
  "variables": {
    "id": "APPOINTMENT_ID_HERE"
  }
}
```

## 10. Get Appointments by User

**Body (raw JSON):**
```json
{
  "query": "query GetAppointmentsByUser($userId: String!) { appointmentsByUser(userId: $userId) { id date time type reason confirmed cancelled googleEventId googleMeetLink } }",
  "variables": {
    "userId": "USER_ID_HERE"
  }
}
```

## 11. Get Upcoming Appointments

**Body (raw JSON):**
```json
{
  "query": "query { upcomingAppointments { id date time type reason confirmed user { firstName lastName email } psychologist { firstName lastName email } } }"
}
```

## 12. Confirm Appointment

**Body (raw JSON):**
```json
{
  "query": "mutation ConfirmAppointment($id: String!) { confirmAppointment(id: $id) { id confirmed } }",
  "variables": {
    "id": "APPOINTMENT_ID_HERE"
  }
}
```

## 13. Cancel Appointment

**Body (raw JSON):**
```json
{
  "query": "mutation CancelAppointment($id: String!) { cancelAppointment(id: $id) { id cancelled } }",
  "variables": {
    "id": "APPOINTMENT_ID_HERE"
  }
}
```

## 14. Update Appointment

**Body (raw JSON):**
```json
{
  "query": "mutation UpdateAppointment($id: String!, $updateAppointmentInput: UpdateAppointmentInput!) { updateAppointment(id: $id, updateAppointmentInput: $updateAppointmentInput) { id date time type reason } }",
  "variables": {
    "id": "APPOINTMENT_ID_HERE",
    "updateAppointmentInput": {
      "time": "15:30",
      "reason": "Updated appointment reason"
    }
  }
}
```

## 15. Update User

**Body (raw JSON):**
```json
{
  "query": "mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) { updateUser(id: $id, updateUserInput: $updateUserInput) { id rut firstName lastName email phone address } }",
  "variables": {
    "id": "USER_ID_HERE",
    "updateUserInput": {
      "phone": "+56911111111",
      "address": "New Address 456, Santiago"
    }
  }
}
```

## Expected Responses

### Create User (Success):
```json
{
  "data": {
    "createUser": {
      "id": "uuid-generated",
      "rut": "12.345.678-9",
      "firstName": "María",
      "lastName": "González López",
      "email": "maria.gonzalez@email.com",
      "phone": "+56912345678",
      "address": "Av. Providencia 123, Santiago",
      "createdAt": "2024-12-25T10:00:00.000Z"
    }
  }
}
```

### Create Appointment (Success):
```json
{
  "data": {
    "createAppointment": {
      "id": "appointment-uuid",
      "date": "2024-12-25T00:00:00.000Z",
      "time": "10:00",
      "type": "IN_PERSON",
      "reason": "Initial psychological evaluation",
      "confirmed": false,
      "cancelled": false,
      "googleEventId": "calendar-event-id",
      "googleMeetLink": null,
      "user": {
        "id": "user-uuid",
        "firstName": "María",
        "lastName": "González López",
        "email": "maria.gonzalez@email.com"
      },
      "psychologist": {
        "id": "psychologist-uuid",
        "firstName": "Dr. Ana",
        "lastName": "Silva Martínez",
        "email": "ana.silva@clinic.com"
      }
    }
  }
}
```

### Get Appointments (Empty):
```json
{
  "data": {
    "appointments": []
  }
}
```

### Get Appointments (With Data):
```json
{
  "data": {
    "appointments": [
      {
        "id": "appointment-uuid",
        "date": "2024-12-25T00:00:00.000Z",
        "time": "10:00",
        "type": "IN_PERSON",
        "reason": "Initial psychological evaluation",
        "confirmed": false,
        "cancelled": false,
        "googleEventId": "calendar-event-id",
        "googleMeetLink": null,
        "user": {
          "id": "user-uuid",
          "firstName": "María",
          "lastName": "González López",
          "email": "maria.gonzalez@email.com"
        },
        "psychologist": {
          "id": "psychologist-uuid",
          "firstName": "Dr. Ana",
          "lastName": "Silva Martínez",
          "email": "ana.silva@clinic.com"
        }
      }
    ]
  }
}
```

### Error Response:
```json
{
  "errors": [
    {
      "message": "User not found",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "user"
      ]
    }
  ],
  "data": {
    "user": null
  }
}
```

## Tips for Testing

1. **Replace IDs**: Always replace `USER_ID_HERE`, `APPOINTMENT_ID_HERE`, and `PSYCHOLOGIST_ID_HERE` with actual IDs from your database.

2. **Date Format**: Use `YYYY-MM-DD` format for dates.

3. **Time Format**: Use `HH:MM` format (24-hour) for times.

4. **Appointment Types**: Valid values are `IN_PERSON` and `ONLINE`.

5. **Testing Flow**: 
   - Create a psychologist first
   - Create a user
   - Create appointments
   - Test various queries and mutations

6. **Environment Variables**: Make sure your `.env` file has the correct Google Calendar and email configurations for full functionality. 