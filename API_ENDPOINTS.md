# 🔌 API Endpoints Documentation

Documentación completa de los endpoints REST que el backend Spring Boot debe implementar.

## Base URL

```
http://localhost:8080/api
```

## Autenticación

Todos los endpoints (excepto `/auth/login`) requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

---

## 👤 Authentication

### POST /auth/login
Iniciar sesión

**Request:**
```json
{
  "email": "admin@comandas.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin Principal",
    "email": "admin@comandas.com",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### POST /auth/logout
Cerrar sesión

**Response (200):**
```json
{
  "message": "Sesión cerrada correctamente"
}
```

### GET /auth/me
Obtener usuario actual

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Admin Principal",
  "email": "admin@comandas.com",
  "role": "ADMIN",
  "isActive": true
}
```

---

## 👥 Users

### GET /users
Listar todos los usuarios (Solo ADMIN)

**Query Parameters:**
- `role` (optional): Filtrar por rol (ADMIN, WAITER, CHEF)

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin Principal",
    "email": "admin@comandas.com",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### GET /users/:id
Obtener usuario por ID

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Admin Principal",
  "email": "admin@comandas.com",
  "role": "ADMIN",
  "isActive": true,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### POST /users
Crear nuevo usuario (Solo ADMIN)

**Request:**
```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@comandas.com",
  "password": "password123",
  "role": "WAITER"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Nuevo Usuario",
  "email": "nuevo@comandas.com",
  "role": "WAITER",
  "isActive": true,
  "createdAt": "2026-02-20T00:00:00.000Z",
  "updatedAt": "2026-02-20T00:00:00.000Z"
}
```

### PUT /users/:id
Actualizar usuario

**Request:**
```json
{
  "name": "Nombre Actualizado",
  "isActive": false
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Nombre Actualizado",
  "email": "nuevo@comandas.com",
  "role": "WAITER",
  "isActive": false,
  "updatedAt": "2026-02-20T12:00:00.000Z"
}
```

---

## 🪑 Tables

### GET /tables
Listar todas las mesas

**Query Parameters:**
- `status` (optional): AVAILABLE, OCCUPIED, RESERVED, CLEANING

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "number": 1,
    "capacity": 4,
    "status": "AVAILABLE",
    "currentOrderId": null,
    "location": "main",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-02-20T00:00:00.000Z"
  }
]
```

### GET /tables/:id
Obtener mesa por ID

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "number": 1,
  "capacity": 4,
  "status": "OCCUPIED",
  "currentOrderId": "507f1f77bcf86cd799439020",
  "location": "main",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-02-20T10:30:00.000Z"
}
```

### GET /tables/number/:number
Obtener mesa por número

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "number": 1,
  "capacity": 4,
  "status": "AVAILABLE",
  "currentOrderId": null,
  "location": "main"
}
```

### POST /tables
Crear nueva mesa (Solo ADMIN)

**Request:**
```json
{
  "number": 15,
  "capacity": 6,
  "location": "vip"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "number": 15,
  "capacity": 6,
  "status": "AVAILABLE",
  "currentOrderId": null,
  "location": "vip",
  "createdAt": "2026-02-20T00:00:00.000Z",
  "updatedAt": "2026-02-20T00:00:00.000Z"
}
```

### PUT /tables/:id
Actualizar mesa

**Request:**
```json
{
  "capacity": 8,
  "status": "CLEANING",
  "currentOrderId": null
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "number": 15,
  "capacity": 8,
  "status": "CLEANING",
  "currentOrderId": null,
  "location": "vip",
  "updatedAt": "2026-02-20T11:00:00.000Z"
}
```

---

## 🍽️ Menu Items

### GET /menu-items
Listar items del menú

**Query Parameters:**
- `category` (optional): APPETIZER, MAIN_COURSE, DESSERT, BEVERAGE, SPECIAL
- `available` (optional): true/false

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Filete Mignon",
    "description": "Filete de res premium 250g",
    "price": 380,
    "category": "MAIN_COURSE",
    "imageUrl": "https://example.com/filete.jpg",
    "isAvailable": true,
    "preparationTime": 25,
    "ingredients": ["carne de res", "sal", "pimienta"],
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-15T00:00:00.000Z"
  }
]
```

### GET /menu-items/:id
Obtener item por ID

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "Filete Mignon",
  "description": "Filete de res premium 250g",
  "price": 380,
  "category": "MAIN_COURSE",
  "imageUrl": "https://example.com/filete.jpg",
  "isAvailable": true,
  "preparationTime": 25,
  "ingredients": ["carne de res", "sal", "pimienta"]
}
```

### POST /menu-items
Crear item del menú (Solo ADMIN)

**Request:**
```json
{
  "name": "Nuevo Platillo",
  "description": "Descripción del platillo",
  "price": 150,
  "category": "MAIN_COURSE",
  "imageUrl": "https://example.com/imagen.jpg",
  "preparationTime": 20,
  "ingredients": ["ingrediente1", "ingrediente2"]
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "name": "Nuevo Platillo",
  "description": "Descripción del platillo",
  "price": 150,
  "category": "MAIN_COURSE",
  "imageUrl": "https://example.com/imagen.jpg",
  "isAvailable": true,
  "preparationTime": 20,
  "ingredients": ["ingrediente1", "ingrediente2"],
  "createdAt": "2026-02-20T00:00:00.000Z",
  "updatedAt": "2026-02-20T00:00:00.000Z"
}
```

### PUT /menu-items/:id
Actualizar item del menú

**Request:**
```json
{
  "price": 160,
  "isAvailable": false
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "name": "Nuevo Platillo",
  "price": 160,
  "isAvailable": false,
  "updatedAt": "2026-02-20T12:00:00.000Z"
}
```

### DELETE /menu-items/:id
Eliminar item del menú (Solo ADMIN)

**Response (204):** No content

---

## 📋 Orders

### GET /orders
Listar pedidos

**Query Parameters:**
- `status` (optional): PENDING, CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED
- `tableId` (optional): ID de la mesa
- `waiterId` (optional): ID del mesero

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "tableId": "507f1f77bcf86cd799439013",
    "waiterId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "_id": "item1",
        "menuItemId": "507f1f77bcf86cd799439015",
        "menuItemName": "Filete Mignon",
        "quantity": 2,
        "unitPrice": 380,
        "notes": "Término medio",
        "createdAt": "2026-02-20T10:00:00.000Z"
      }
    ],
    "status": "PREPARING",
    "notes": "Sin cebolla",
    "total": 760,
    "itemCount": 2,
    "createdAt": "2026-02-20T10:00:00.000Z",
    "updatedAt": "2026-02-20T10:15:00.000Z",
    "confirmedAt": "2026-02-20T10:05:00.000Z",
    "deliveredAt": null
  }
]
```

### GET /orders/active
Listar pedidos activos (no entregados ni cancelados)

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "tableId": "507f1f77bcf86cd799439013",
    "status": "PREPARING",
    "items": [...],
    "total": 760
  }
]
```

### GET /orders/:id
Obtener pedido por ID

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "tableId": "507f1f77bcf86cd799439013",
  "waiterId": "507f1f77bcf86cd799439011",
  "items": [...],
  "status": "PREPARING",
  "total": 760
}
```

### POST /orders
Crear nuevo pedido

**Request:**
```json
{
  "tableId": "507f1f77bcf86cd799439013",
  "waiterId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "menuItemId": "507f1f77bcf86cd799439015",
      "menuItemName": "Filete Mignon",
      "quantity": 2,
      "unitPrice": 380,
      "notes": "Término medio"
    }
  ],
  "notes": "Sin cebolla"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "tableId": "507f1f77bcf86cd799439013",
  "waiterId": "507f1f77bcf86cd799439011",
  "items": [...],
  "status": "PENDING",
  "total": 760,
  "itemCount": 2,
  "createdAt": "2026-02-20T12:00:00.000Z"
}
```

### PUT /orders/:id
Actualizar pedido

**Request:**
```json
{
  "status": "CONFIRMED",
  "items": [...],
  "notes": "Actualizado"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "status": "CONFIRMED",
  "confirmedAt": "2026-02-20T12:05:00.000Z",
  "updatedAt": "2026-02-20T12:05:00.000Z"
}
```

### DELETE /orders/:id
Cancelar pedido

**Response (204):** No content

---

## 💳 Payments

### GET /payments
Listar pagos

**Query Parameters:**
- `status` (optional): PENDING, PAID, PARTIAL, REFUNDED

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439030",
    "orderId": "507f1f77bcf86cd799439020",
    "amount": 760,
    "method": "CARD",
    "status": "PAID",
    "paidAmount": 760,
    "createdAt": "2026-02-20T11:00:00.000Z",
    "updatedAt": "2026-02-20T11:05:00.000Z",
    "paidAt": "2026-02-20T11:05:00.000Z"
  }
]
```

### GET /payments/:id
Obtener pago por ID

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439030",
  "orderId": "507f1f77bcf86cd799439020",
  "amount": 760,
  "method": "CARD",
  "status": "PAID",
  "paidAmount": 760
}
```

### GET /payments/order/:orderId
Obtener pago de un pedido

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439030",
  "orderId": "507f1f77bcf86cd799439020",
  "amount": 760,
  "status": "PAID"
}
```

### POST /payments
Crear pago

**Request:**
```json
{
  "orderId": "507f1f77bcf86cd799439020",
  "amount": 760,
  "method": "CARD"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439031",
  "orderId": "507f1f77bcf86cd799439020",
  "amount": 760,
  "method": "CARD",
  "status": "PENDING",
  "paidAmount": 0,
  "createdAt": "2026-02-20T12:00:00.000Z"
}
```

### PUT /payments/:id
Procesar pago

**Request:**
```json
{
  "paidAmount": 760,
  "status": "PAID"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439031",
  "status": "PAID",
  "paidAmount": 760,
  "paidAt": "2026-02-20T12:05:00.000Z"
}
```

---

## 🔌 WebSocket Events

El sistema emite eventos en tiempo real a través de WebSocket.

### Conexión
```javascript
const socket = io('http://localhost:8080', {
  auth: {
    token: '<JWT_TOKEN>'
  }
});
```

### Eventos de Pedidos

#### order:created
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "tableId": "507f1f77bcf86cd799439013",
  "status": "PENDING",
  "total": 760
}
```

#### order:updated
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "status": "CONFIRMED",
  "updatedAt": "2026-02-20T12:00:00.000Z"
}
```

#### order:confirmed, order:preparing, order:ready, order:delivered
Mismo formato que `order:updated`

### Eventos de Mesas

#### table:updated
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "number": 1,
  "status": "OCCUPIED",
  "currentOrderId": "507f1f77bcf86cd799439020"
}
```

#### table:freed
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "status": "CLEANING",
  "currentOrderId": null
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Validation error",
  "details": ["Field 'email' is required"]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Token inválido o expirado"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "No tienes permisos para esta acción"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Recurso no encontrado"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Error interno del servidor"
}
```

---

## 🔐 Roles y Permisos

| Endpoint | ADMIN | WAITER | CHEF |
|----------|-------|--------|------|
| POST /users | ✅ | ❌ | ❌ |
| POST /tables | ✅ | ❌ | ❌ |
| POST /menu-items | ✅ | ❌ | ❌ |
| POST /orders | ✅ | ✅ | ❌ |
| PUT /orders/:id (status) | ✅ | ✅ | ✅ |
| POST /payments | ✅ | ✅ | ❌ |

---

**Nota:** Todos los endpoints deben validar los datos de entrada y retornar errores apropiados con códigos HTTP correctos.
