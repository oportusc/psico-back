# Testing Guide - Psychological Consultation API

This guide provides comprehensive testing examples for the Psychological Consultation API built with NestJS, GraphQL, and MongoDB.

## Quick Start

1. Start the backend server:
```bash
cd psico-backend
yarn install
yarn start:dev
```

2. Access GraphQL Playground at: `http://localhost:3000/graphql`

## GraphQL Playground Examples

### 1. Create Users

```graphql
mutation CreateUser {
  createUser(
    createUserInput: {
      name: "Juan Carlos"
      email: "juan.carlos@email.com"
      phone: "+56912345678"
      address: "Av. Providencia 123, Santiago"
    }
  ) {
    id
    name
    email
    phone
    address
    createdAt
    updatedAt
  }
}
```

### 2. Create Psychologists

```graphql
mutation CreatePsychologist {
  createPsychologist(
    createPsychologistInput: {
      name: "Dra. María González"
      email: "maria.gonzalez@psicologa.com"
      phone: "+56987654321"
      specialization: "Psicología Clínica"
      license: "PSI-12345"
      address: "Av. Las Condes 456, Santiago"
    }
  ) {
    id
    name
    email
    phone
    specialization
    license
    address
    createdAt
    updatedAt
  }
}
```

### 3. Create Appointments

```graphql
mutation CreateAppointment {
  createAppointment(
    createAppointmentInput: {
      date: "2024-12-25"
      time: "14:30"
      type: ONLINE
      reason: "Consulta de evaluación inicial"
      userId: "507f1f77bcf86cd799439011"
      psychologistId: "507f1f77bcf86cd799439012"
    }
  ) {
    id
    date
    time
    type
    reason
    confirmed
    cancelled
    createdAt
    updatedAt
    userId
    psychologistId
    googleEventId
    googleMeetLink
  }
}
```

### 4. Query Examples

#### Get All Users
```graphql
query GetUsers {
  users {
    id
    name
    email
    phone
    address
    createdAt
  }
}
```

#### Get All Psychologists
```graphql
query GetPsychologists {
  psychologists {
    id
    name
    email
    phone
    specialization
    license
    address
    createdAt
  }
}
```

#### Get All Appointments
```graphql
query GetAppointments {
  appointments {
    id
    date
    time
    type
    reason
    confirmed
    cancelled
    user {
      id
      name
      email
    }
    psychologist {
      id
      name
      email
    }
    createdAt
  }
}
```

#### Get Appointments by User
```graphql
query GetAppointmentsByUser {
  appointmentsByUser(userId: "507f1f77bcf86cd799439011") {
    id
    date
    time
    type
    reason
    confirmed
    cancelled
    psychologist {
      name
      email
    }
  }
}
```

#### Get Upcoming Appointments
```graphql
query GetUpcomingAppointments {
  upcomingAppointments {
    id
    date
    time
    type
    reason
    user {
      name
      email
    }
    psychologist {
      name
      email
    }
  }
}
```

### 5. Update Operations

#### Update User
```graphql
mutation UpdateUser {
  updateUser(
    id: "507f1f77bcf86cd799439011"
    updateUserInput: {
      phone: "+56998765432"
      address: "Nueva dirección 789, Santiago"
    }
  ) {
    id
    name
    email
    phone
    address
    updatedAt
  }
}
```

#### Update Psychologist
```graphql
mutation UpdatePsychologist {
  updatePsychologist(
    id: "507f1f77bcf86cd799439012"
    updatePsychologistInput: {
      specialization: "Psicología Infantil y Adolescente"
      phone: "+56911223344"
    }
  ) {
    id
    name
    email
    specialization
    phone
    updatedAt
  }
}
```

#### Update Appointment
```graphql
mutation UpdateAppointment {
  updateAppointment(
    id: "507f1f77bcf86cd799439013"
    updateAppointmentInput: {
      time: "15:00"
      reason: "Seguimiento de tratamiento"
    }
  ) {
    id
    date
    time
    type
    reason
    updatedAt
  }
}
```

### 6. Appointment Management

#### Confirm Appointment
```graphql
mutation ConfirmAppointment {
  confirmAppointment(id: "507f1f77bcf86cd799439013") {
    id
    confirmed
    cancelled
    updatedAt
  }
}
```

#### Cancel Appointment
```graphql
mutation CancelAppointment {
  cancelAppointment(id: "507f1f77bcf86cd799439013") {
    id
    confirmed
    cancelled
    updatedAt
  }
}
```

### 7. Delete Operations

#### Delete User
```graphql
mutation DeleteUser {
  removeUser(id: "507f1f77bcf86cd799439011") {
    id
    name
    email
  }
}
```

#### Delete Psychologist
```graphql
mutation DeletePsychologist {
  removePsychologist(id: "507f1f77bcf86cd799439012") {
    id
    name
    email
  }
}
```

#### Delete Appointment
```graphql
mutation DeleteAppointment {
  removeAppointment(id: "507f1f77bcf86cd799439013") {
    id
    date
    time
    reason
  }
}
```

## cURL Examples

### Create User
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createUser(createUserInput: { name: \"Juan Carlos\", email: \"juan@email.com\", phone: \"+56912345678\", address: \"Av. Providencia 123\" }) { id name email phone address } }"
  }'
```

### Create Psychologist
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createPsychologist(createPsychologistInput: { name: \"Dra. María González\", email: \"maria@psicologa.com\", phone: \"+56987654321\", specialization: \"Psicología Clínica\", license: \"PSI-12345\", address: \"Av. Las Condes 456\" }) { id name email specialization license } }"
  }'
```

### Create Appointment
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createAppointment(createAppointmentInput: { date: \"2024-12-25\", time: \"14:30\", type: ONLINE, reason: \"Consulta inicial\", userId: \"507f1f77bcf86cd799439011\", psychologistId: \"507f1f77bcf86cd799439012\" }) { id date time type reason confirmed cancelled } }"
  }'
```

### Get All Users
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id name email phone address createdAt } }"
  }'
```

## Validation Rules

### User Validation
- `name`: Required, string
- `email`: Required, valid email format, unique
- `phone`: Required, string
- `address`: Optional, string

### Psychologist Validation
- `name`: Required, string
- `email`: Required, valid email format, unique
- `phone`: Required, string
- `specialization`: Required, string
- `license`: Required, string, unique
- `address`: Required, string

### Appointment Validation
- `date`: Required, format YYYY-MM-DD, cannot be in the past
- `time`: Required, format HH:MM (24-hour)
- `type`: Required, enum (ONLINE or IN_PERSON)
- `reason`: Required, string
- `userId`: Required, valid MongoDB ObjectId, user must exist
- `psychologistId`: Required, valid MongoDB ObjectId, psychologist must exist

## Error Handling

The API returns detailed error messages for validation failures:

```json
{
  "errors": [
    {
      "message": "Validation failed",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "exception": {
          "validationErrors": [
            {
              "target": {
                "email": "invalid-email"
              },
              "value": "invalid-email",
              "property": "email",
              "children": [],
              "constraints": {
                "isEmail": "email must be an email"
              }
            }
          ]
        }
      }
    }
  ]
}
```

## Testing Tips

1. **Use Real ObjectIds**: Replace placeholder ObjectIds with real ones from your database
2. **Check Relationships**: Ensure users and psychologists exist before creating appointments
3. **Date Validation**: Use future dates for appointments
4. **Time Format**: Use 24-hour format (HH:MM)
5. **Unique Constraints**: Email addresses and psychologist licenses must be unique

## Environment Setup

Make sure your `.env` file is properly configured:

```env
MONGODB_URI=mongodb://localhost:27017/psico_db
NODE_ENV=development
PORT=3000
```

## Database Setup

The application uses MongoDB with Mongoose. Collections are created automatically when you first insert data.

## Google Calendar Integration

When appointments are created, they can be automatically added to Google Calendar if configured. The integration includes:

- Google Meet links for online appointments
- Calendar event creation
- Email notifications

See `CONFIGURACION-EMAIL-GOOGLE-MEET.md` for detailed setup instructions. 