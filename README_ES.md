# API de Consultas Psicológicas

Una API backend moderna para gestionar consultas psicológicas, desarrollada con NestJS, GraphQL y MongoDB.

**Desarrollado por:** Oscar Portus Cabrera  
**Contacto:** oportus.c@gmail.com

## 🌟 Características

- **Gestión de Usuarios**: Crear, leer, actualizar y eliminar usuarios con información personal
- **Gestión de Psicólogos**: Administrar perfiles de psicólogos con especializaciones y licencias
- **Programación de Citas**: Programar, confirmar, cancelar y gestionar consultas psicológicas
- **Sistema Multi-Psicólogo**: Soporte para múltiples psicólogos con horarios individuales
- **Tipos de Consulta**: Soporte para consultas online y presenciales
- **Integración con Google Calendar**: Creación automática de eventos de calendario y enlaces de Google Meet
- **Notificaciones por Email**: Notificaciones automáticas por email para citas
- **API GraphQL**: API moderna con GraphQL para consultas y mutaciones flexibles
- **Validación de Datos**: Validación integral de entrada con mensajes de error detallados
- **MongoDB**: Base de datos NoSQL para almacenamiento flexible de datos

## 🏗️ Estructura del Proyecto

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

## 📊 Modelos de Datos

### Usuario
- `id`: MongoDB ObjectId
- `name`: Nombre completo del usuario
- `email`: Dirección de email única
- `phone`: Número de teléfono
- `address`: Dirección (opcional)
- `createdAt`: Timestamp de creación
- `updatedAt`: Timestamp de última actualización

### Psicólogo
- `id`: MongoDB ObjectId
- `name`: Nombre completo del psicólogo
- `email`: Dirección de email única
- `phone`: Número de teléfono
- `specialization`: Área de especialización
- `license`: Número de licencia profesional única
- `address`: Dirección de la oficina
- `createdAt`: Timestamp de creación
- `updatedAt`: Timestamp de última actualización

### Cita
- `id`: MongoDB ObjectId
- `date`: Fecha de la cita (YYYY-MM-DD)
- `time`: Hora de la cita (HH:MM)
- `type`: Tipo de cita (ONLINE o IN_PERSON)
- `reason`: Motivo de la consulta
- `confirmed`: Estado de confirmación
- `cancelled`: Estado de cancelación
- `userId`: Referencia al usuario
- `psychologistId`: Referencia al psicólogo
- `googleEventId`: ID del evento de Google Calendar
- `googleMeetLink`: Enlace de Google Meet para sesiones online
- `createdAt`: Timestamp de creación
- `updatedAt`: Timestamp de última actualización

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (local o en la nube)
- Yarn o npm

### Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd psico-backend
```

2. **Instalar dependencias**
```bash
yarn install
```

3. **Configuración del entorno**
Crear un archivo `.env` en el directorio raíz:
```env
MONGODB_URI=mongodb://localhost:27017/psico_db
NODE_ENV=development
PORT=3000
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
```

4. **Iniciar MongoDB** (si usas instancia local)
```bash
# Usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# O iniciar tu servicio local de MongoDB
```

5. **Ejecutar la aplicación**
```bash
# Modo desarrollo
yarn start:dev

# Modo producción
yarn build
yarn start:prod
```

6. **Acceder al GraphQL Playground**
Abrir tu navegador y ir a: `http://localhost:3000/graphql`

## 📚 Uso de la API

### GraphQL Playground
El GraphQL Playground proporciona una interfaz interactiva para probar todas las operaciones de la API. Visita `http://localhost:3000/graphql` para acceder.

### Operaciones Principales

#### Usuarios
- `createUser`: Crear nuevo usuario
- `users`: Obtener todos los usuarios
- `user`: Obtener usuario por ID
- `updateUser`: Actualizar información del usuario
- `removeUser`: Eliminar usuario

#### Psicólogos
- `createPsychologist`: Crear nuevo psicólogo
- `psychologists`: Obtener todos los psicólogos
- `psychologist`: Obtener psicólogo por ID
- `updatePsychologist`: Actualizar información del psicólogo
- `removePsychologist`: Eliminar psicólogo

#### Citas
- `createAppointment`: Programar nueva cita
- `appointments`: Obtener todas las citas
- `appointment`: Obtener cita por ID
- `appointmentsByUser`: Obtener citas de un usuario
- `appointmentsByPsychologist`: Obtener citas de un psicólogo
- `upcomingAppointments`: Obtener citas futuras
- `pastAppointments`: Obtener citas pasadas
- `confirmAppointment`: Confirmar cita
- `cancelAppointment`: Cancelar cita
- `updateAppointment`: Actualizar detalles de la cita
- `removeAppointment`: Eliminar cita

## 🔧 Configuración

### Integración con Google Calendar
La API puede crear automáticamente eventos de Google Calendar y enlaces de Google Meet para las citas. Ver `CONFIGURACION-EMAIL-GOOGLE-MEET.md` para instrucciones detalladas de configuración.

### Notificaciones por Email
Configurar ajustes de email para enviar notificaciones automáticas para confirmaciones, cancelaciones y recordatorios de citas.

## 🧪 Pruebas

Ejemplos completos de pruebas están disponibles en `TESTING-GUIDE.md`, incluyendo:
- Mutaciones y consultas GraphQL
- Ejemplos de cURL
- Reglas de validación
- Manejo de errores

## 📋 Reglas de Validación

### Validación de Usuario
- `name`: Requerido, string
- `email`: Requerido, formato de email válido, único
- `phone`: Requerido, string
- `address`: Opcional, string

### Validación de Psicólogo
- `name`: Requerido, string
- `email`: Requerido, formato de email válido, único
- `phone`: Requerido, string
- `specialization`: Requerido, string
- `license`: Requerido, string, único
- `address`: Requerido, string

### Validación de Cita
- `date`: Requerido, formato YYYY-MM-DD, no puede ser en el pasado
- `time`: Requerido, formato HH:MM (24 horas)
- `type`: Requerido, enum (ONLINE o IN_PERSON)
- `reason`: Requerido, string
- `userId`: Requerido, MongoDB ObjectId válido, usuario debe existir
- `psychologistId`: Requerido, MongoDB ObjectId válido, psicólogo debe existir

## 🛠️ Tecnologías

- **NestJS**: Framework progresivo de Node.js
- **GraphQL**: Lenguaje de consulta y runtime
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: Modelado de objetos de MongoDB
- **Apollo Server**: Servidor GraphQL
- **class-validator**: Decoradores de validación
- **Google Calendar API**: Integración de calendario
- **Nodemailer**: Funcionalidad de email

## 📝 Scripts Disponibles

```bash
# Desarrollo
yarn start:dev

# Compilar
yarn build

# Producción
yarn start:prod

# Pruebas
yarn test
yarn test:e2e
yarn test:cov

# Linting
yarn lint
yarn lint:fix
```

## 🤝 Contribución

1. Hacer fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para soporte y preguntas, por favor contacta:
- **Email:** oportus.c@gmail.com
- **Desarrollador:** Oscar Portus Cabrera

---

**Nota:** Esta es la versión en español. Para documentación en inglés, ver [README.md](./README.md) 