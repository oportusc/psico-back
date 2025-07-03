# API de Consultas Psicológicas

Backend desarrollado con NestJS, GraphQL y PostgreSQL para gestionar consultas psicológicas.

## Características

- **Gestión de Usuarios**: Crear, leer, actualizar y eliminar usuarios con información personal
- **Gestión de Consultas**: Programar, confirmar, cancelar y gestionar consultas psicológicas
- **Validaciones**: Validación de datos de entrada con formatos específicos
- **Relaciones**: Usuarios pueden tener múltiples consultas
- **Tipos de Consulta**: Soporte para consultas online y presenciales
- **GraphQL API**: API moderna con GraphQL para consultas flexibles

## Estructura del Proyecto

```
src/
├── usuarios/
│   ├── dto/
│   │   ├── create-usuario.input.ts
│   │   └── update-usuario.input.ts
│   ├── usuario.entity.ts
│   ├── usuarios.service.ts
│   ├── usuarios.resolver.ts
│   └── usuarios.module.ts
├── consultas/
│   ├── dto/
│   │   ├── create-consulta.input.ts
│   │   └── update-consulta.input.ts
│   ├── consulta.entity.ts
│   ├── consultas.service.ts
│   ├── consultas.resolver.ts
│   └── consultas.module.ts
├── app.module.ts
├── main.ts
└── schema.gql
```

## Entidades

### Usuario
- `id`: UUID único
- `rut`: RUT chileno único (formato XX.XXX.XXX-X)
- `nombre`: Nombre del usuario
- `apellidos`: Apellidos del usuario
- `correo`: Email único
- `telefono`: Número de teléfono
- `direccion`: Dirección (opcional)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización

### Consulta
- `id`: UUID único
- `fecha`: Fecha de la consulta
- `hora`: Hora de la consulta (formato HH:MM)
- `tipo`: Tipo de consulta (ONLINE o PRESENCIAL)
- `motivo`: Motivo de la consulta
- `confirmada`: Estado de confirmación
- `cancelada`: Estado de cancelación
- `usuarioId`: ID del usuario asociado
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno en `.env`:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=psico_db
NODE_ENV=development
```

4. Levantar la base de datos con Docker:
```bash
docker-compose up -d
```

5. Ejecutar el proyecto:
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Uso de la API

### GraphQL Playground
Acceder a `http://localhost:3000/graphql` para usar el GraphQL Playground.

### Ejemplos de cURL
Ver el archivo `test-curl-examples.md` para ejemplos completos de todas las operaciones.

### Operaciones Principales

#### Usuarios
- `createUsuario`: Crear nuevo usuario
- `usuarios`: Obtener todos los usuarios
- `usuario`: Obtener usuario por ID
- `usuarioByRut`: Obtener usuario por RUT
- `updateUsuario`: Actualizar usuario
- `removeUsuario`: Eliminar usuario

#### Consultas
- `createConsulta`: Crear nueva consulta
- `consultas`: Obtener todas las consultas
- `consulta`: Obtener consulta por ID
- `consultasByUsuario`: Obtener consultas de un usuario
- `consultasProximas`: Obtener consultas futuras
- `consultasPasadas`: Obtener consultas pasadas
- `confirmarConsulta`: Confirmar una consulta
- `cancelarConsulta`: Cancelar una consulta
- `updateConsulta`: Actualizar consulta
- `removeConsulta`: Eliminar consulta

## Validaciones

### Usuario
- RUT debe tener formato `XX.XXX.XXX-X`
- Email debe ser válido
- Teléfono debe tener formato internacional
- RUT y email deben ser únicos

### Consulta
- Fecha no puede ser en el pasado
- Hora debe tener formato `HH:MM`
- No puede haber dos consultas en la misma fecha y hora
- Usuario debe existir

## Tecnologías Utilizadas

- **NestJS**: Framework de Node.js
- **GraphQL**: API Query Language
- **TypeORM**: ORM para PostgreSQL
- **PostgreSQL**: Base de datos
- **Docker**: Contenedorización
- **class-validator**: Validación de datos
- **Apollo Server**: Servidor GraphQL

## Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Compilar
npm run build

# Producción
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov
```

### Estructura de Base de Datos

Las tablas se crean automáticamente con `synchronize: true` en desarrollo. En producción, usar migraciones.

### Relaciones

- Un usuario puede tener múltiples consultas
- Al eliminar un usuario, se eliminan todas sus consultas (cascade delete)

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. 