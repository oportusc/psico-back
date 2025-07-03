# Ejemplos de Postman para GraphQL API

## Configuración Base
- **URL:** `http://localhost:3000/graphql`
- **Método:** POST
- **Headers:** 
  - `Content-Type: application/json`

## 1. Crear un Plato

**Body (raw JSON):**
```json
{
  "query": "mutation { createPlato(createPlatoInput: { nombre: \"Pasta Carbonara\", descripcion: \"Pasta italiana con salsa cremosa y panceta\", precio: 18.99, categoria: \"Pasta\", disponible: true }) { id nombre descripcion precio categoria disponible createdAt } }"
}
```

## 2. Obtener Todos los Platos

**Body (raw JSON):**
```json
{
  "query": "query { platos { id nombre descripcion precio categoria disponible createdAt } }"
}
```

## 3. Obtener un Plato por ID

**Body (raw JSON):**
```json
{
  "query": "query { plato(id: 1) { id nombre descripcion precio categoria disponible createdAt } }"
}
```

## 4. Actualizar un Plato

**Body (raw JSON):**
```json
{
  "query": "mutation { updatePlato(updatePlatoInput: { id: 1, precio: 20.99, descripcion: \"Pasta italiana con salsa cremosa, panceta y queso parmesano\" }) { id nombre descripcion precio categoria disponible } }"
}
```

## 5. Eliminar un Plato

**Body (raw JSON):**
```json
{
  "query": "mutation { removePlato(id: 1) { id nombre } }"
}
```

## 6. Crear Múltiples Platos

**Pizza Margherita:**
```json
{
  "query": "mutation { createPlato(createPlatoInput: { nombre: \"Pizza Margherita\", descripcion: \"Pizza tradicional italiana con tomate, mozzarella y albahaca\", precio: 14.99, categoria: \"Pizza\", disponible: true }) { id nombre descripcion precio categoria disponible createdAt } }"
}
```

**Ensalada César:**
```json
{
  "query": "mutation { createPlato(createPlatoInput: { nombre: \"Ensalada César\", descripcion: \"Ensalada fresca con lechuga, crutones, parmesano y aderezo César\", precio: 9.99, categoria: \"Ensalada\", disponible: true }) { id nombre descripcion precio categoria disponible createdAt } }"
}
```

**Tiramisú:**
```json
{
  "query": "mutation { createPlato(createPlatoInput: { nombre: \"Tiramisú\", descripcion: \"Postre italiano con café, mascarpone y cacao\", precio: 7.99, categoria: \"Postre\", disponible: true }) { id nombre descripcion precio categoria disponible createdAt } }"
}
```

## Respuestas Esperadas

### Crear Plato (Exitosa):
```json
{
  "data": {
    "createPlato": {
      "id": "1",
      "nombre": "Pasta Carbonara",
      "descripcion": "Pasta italiana con salsa cremosa y panceta",
      "precio": 18.99,
      "categoria": "Pasta",
      "disponible": true,
      "createdAt": "2025-07-03T04:14:04.081Z"
    }
  }
}
```

### Obtener Platos (Vacío):
```json
{
  "data": {
    "platos": []
  }
}
```

### Obtener Platos (Con datos):
```json
{
  "data": {
    "platos": [
      {
        "id": "1",
        "nombre": "Pasta Carbonara",
        "descripcion": "Pasta italiana con salsa cremosa y panceta",
        "precio": 18.99,
        "categoria": "Pasta",
        "disponible": true,
        "createdAt": "2025-07-03T04:14:04.081Z"
      }
    ]
  }
}
``` 