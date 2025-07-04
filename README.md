# Psychological Consultation API

A modern backend API for managing psychological consultations, built with NestJS, GraphQL, and MongoDB.

**Developed by:** Oscar Portus Cabrera  
**Contact:** oportus.c@gmail.com

## 🌟 Features

- **User Management**: Create, read, update, and delete users with personal information
- **Psychologist Management**: Manage psychologist profiles with specializations and licenses
- **Appointment Scheduling**: Schedule, confirm, cancel, and manage psychological consultations
- **Multi-Psychologist System**: Support for multiple psychologists with individual schedules
- **Appointment Types**: Support for both online and in-person consultations
- **Google Calendar Integration**: Automatic calendar event creation and Google Meet links
- **Email Notifications**: Automated email notifications for appointments
- **GraphQL API**: Modern API with GraphQL for flexible queries and mutations
- **Data Validation**: Comprehensive input validation with detailed error messages
- **MongoDB**: NoSQL database for flexible data storage

## 🏗️ Project Structure

```
src/
├── users/
│   ├── dto/
│   │   ├── create-user.input.ts
│   │   └── update-user.input.ts
│   ├── user.entity.ts
│   ├── users.service.ts
│   ├── users.resolver.ts
│   └── users.module.ts
├── psychologists/
│   ├── dto/
│   │   ├── create-psychologist.input.ts
│   │   └── update-psychologist.input.ts
│   ├── psychologist.entity.ts
│   ├── psychologists.service.ts
│   ├── psychologists.resolver.ts
│   └── psychologists.module.ts
├── appointments/
│   ├── dto/
│   │   ├── create-appointment.input.ts
│   │   └── update-appointment.input.ts
│   ├── appointment.entity.ts
│   ├── appointments.service.ts
│   ├── appointments.resolver.ts
│   └── appointments.module.ts
├── calendar/
│   ├── calendar.module.ts
│   ├── calendar.resolver.ts
│   ├── email.service.ts
│   └── google-calendar.service.ts
├── app.module.ts
├── main.ts
└── schema.gql
```

## 📊 Data Models

### User
- `id`: MongoDB ObjectId
- `name`: User's full name
- `email`: Unique email address
- `phone`: Phone number
- `address`: Optional address
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Psychologist
- `id`: MongoDB ObjectId
- `name`: Psychologist's full name
- `email`: Unique email address
- `phone`: Phone number
- `specialization`: Area of expertise
- `license`: Unique professional license number
- `address`: Office address
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Appointment
- `id`: MongoDB ObjectId
- `date`: Appointment date (YYYY-MM-DD)
- `time`: Appointment time (HH:MM)
- `type`: Appointment type (ONLINE or IN_PERSON)
- `reason`: Consultation reason
- `confirmed`: Confirmation status
- `cancelled`: Cancellation status
- `userId`: Reference to user
- `psychologistId`: Reference to psychologist
- `googleEventId`: Google Calendar event ID
- `googleMeetLink`: Google Meet link for online sessions
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Yarn or npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd psico-backend
```

2. **Install dependencies**
```bash
yarn install
```

3. **Environment setup**
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/psico_db
NODE_ENV=development
PORT=3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. **Start MongoDB** (if using local instance)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start your local MongoDB service
```

5. **Run the application**
```bash
# Development mode
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

6. **Access GraphQL Playground**
Open your browser and go to: `http://localhost:3000/graphql`

## 📚 API Usage

### GraphQL Playground
The GraphQL Playground provides an interactive interface to test all API operations. Visit `http://localhost:3000/graphql` to access it.

### Key Operations

#### Users
- `createUser`: Create new user
- `users`: Get all users
- `user`: Get user by ID
- `updateUser`: Update user information
- `removeUser`: Delete user

#### Psychologists
- `createPsychologist`: Create new psychologist
- `psychologists`: Get all psychologists
- `psychologist`: Get psychologist by ID
- `updatePsychologist`: Update psychologist information
- `removePsychologist`: Delete psychologist

#### Appointments
- `createAppointment`: Schedule new appointment
- `appointments`: Get all appointments
- `appointment`: Get appointment by ID
- `appointmentsByUser`: Get user's appointments
- `appointmentsByPsychologist`: Get psychologist's appointments
- `upcomingAppointments`: Get future appointments
- `pastAppointments`: Get past appointments
- `confirmAppointment`: Confirm appointment
- `cancelAppointment`: Cancel appointment
- `updateAppointment`: Update appointment details
- `removeAppointment`: Delete appointment

## 🔧 Configuration

### Google Calendar Integration
The API can automatically create Google Calendar events and Google Meet links for appointments. See `CONFIGURACION-EMAIL-GOOGLE-MEET.md` for detailed setup instructions.

### Email Notifications
Configure email settings to send automatic notifications for appointment confirmations, cancellations, and reminders.

## 🧪 Testing

Comprehensive testing examples are available in `TESTING-GUIDE.md`, including:
- GraphQL mutations and queries
- cURL examples
- Validation rules
- Error handling

## 📋 Validation Rules

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

## 🛠️ Technologies

- **NestJS**: Progressive Node.js framework
- **GraphQL**: Query language and runtime
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Apollo Server**: GraphQL server
- **class-validator**: Validation decorators
- **Google Calendar API**: Calendar integration
- **Nodemailer**: Email functionality

## 📝 Available Scripts

```bash
# Development
yarn start:dev

# Build
yarn build

# Production
yarn start:prod

# Testing
yarn test
yarn test:e2e
yarn test:cov

# Linting
yarn lint
yarn lint:fix
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact:
- **Email:** oportus.c@gmail.com
- **Developer:** Oscar Portus Cabrera

---

**Note:** This is the English version. For Spanish documentation, see [README_ES.md](./README_ES.md) 