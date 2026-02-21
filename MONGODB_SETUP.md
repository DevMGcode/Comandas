# 📊 Configuración de Base de Datos MongoDB

Este documento explica cómo configurar MongoDB para el sistema de comandas.

## 🎯 Opciones de Base de Datos

### Opción 1: MongoDB Atlas (Recomendado para Producción)

MongoDB Atlas es un servicio de base de datos en la nube totalmente administrado.

#### Pasos para configurar MongoDB Atlas:

1. **Crear una cuenta gratuita:**
   - Ve a [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Regístrate con tu email o cuenta de Google
   - Selecciona el plan FREE (M0 Sandbox)

2. **Crear un Cluster:**
   - Haz clic en "Build a Database"
   - Selecciona "FREE" tier
   - Elige tu región más cercana (ej: AWS / us-east-1)
   - Nombre tu cluster: `comandas-cluster`
   - Haz clic en "Create Cluster"

3. **Configurar acceso:**
   - **Usuario de base de datos:**
     - Ve a "Database Access"
     - Crea un usuario: `comandas_admin`
     - Contraseña segura (guárdala)
     - Rol: "Atlas admin" o "Read and write to any database"
   
   - **IP Whitelist:**
     - Ve a "Network Access"
     - Haz clic en "Add IP Address"
     - Para desarrollo: "Allow Access from Anywhere" (0.0.0.0/0)
     - Para producción: añade tu IP específica

4. **Obtener Connection String:**
   - Ve a tu cluster
   - Haz clic en "Connect"
   - Selecciona "Connect your application"
   - Copia el connection string
   - Formato: `mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/`

5. **Configurar en tu proyecto:**
   ```env
   VITE_MONGODB_URI=mongodb+srv://TU_USUARIO:TU_CONTRASEÑA@tu-cluster.xxxxx.mongodb.net/comandas-restaurant?retryWrites=true&w=majority
   ```

### Opción 2: MongoDB Local (Desarrollo)

#### Windows:

1. **Descargar MongoDB:**
   - Ve a [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Descarga la versión Community para Windows
   - Instala con las opciones por defecto

2. **Iniciar MongoDB:**
   ```bash
   # Desde línea de comandos
   mongod
   
   # O usando servicios de Windows
   net start MongoDB
   ```

3. **Connection String:**
   ```env
   VITE_MONGODB_URI=mongodb://localhost:27017/comandas-restaurant
   ```

#### Linux/Mac:

```bash
# Instalar MongoDB
# Ubuntu/Debian
sudo apt-get install -y mongodb-org

# Mac (Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Iniciar servicio
sudo systemctl start mongod    # Linux
brew services start mongodb-community  # Mac

# Connection String
VITE_MONGODB_URI=mongodb://localhost:27017/comandas-restaurant
```

## 📦 Estructura de Colecciones

El sistema utiliza las siguientes colecciones en MongoDB:

### 1. **users** - Usuarios del sistema
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "ADMIN | WAITER | CHEF",
  "isActive": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 2. **tables** - Mesas del restaurante
```json
{
  "_id": "ObjectId",
  "number": "number",
  "capacity": "number",
  "status": "AVAILABLE | OCCUPIED | RESERVED | CLEANING",
  "currentOrderId": "string | null",
  "location": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3. **menuitems** - Elementos del menú
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "APPETIZER | MAIN_COURSE | DESSERT | BEVERAGE | SPECIAL",
  "imageUrl": "string | null",
  "isAvailable": "boolean",
  "preparationTime": "number",
  "ingredients": ["string"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 4. **orders** - Pedidos
```json
{
  "_id": "ObjectId",
  "tableId": "string",
  "waiterId": "string",
  "items": [{
    "_id": "string",
    "menuItemId": "string",
    "menuItemName": "string",
    "quantity": "number",
    "unitPrice": "number",
    "notes": "string"
  }],
  "status": "PENDING | CONFIRMED | PREPARING | READY | DELIVERED | CANCELLED",
  "notes": "string",
  "total": "number",
  "itemCount": "number",
  "createdAt": "Date",
  "updatedAt": "Date",
  "confirmedAt": "Date | null",
  "deliveredAt": "Date | null"
}
```

### 5. **payments** - Pagos
```json
{
  "_id": "ObjectId",
  "orderId": "string",
  "amount": "number",
  "method": "CASH | CARD | DIGITAL",
  "status": "PENDING | PAID | PARTIAL | REFUNDED",
  "paidAmount": "number",
  "createdAt": "Date",
  "updatedAt": "Date",
  "paidAt": "Date | null"
}
```

## 🔧 Índices Importantes

Para optimizar el rendimiento, crea estos índices:

```javascript
// users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// tables
db.tables.createIndex({ number: 1 }, { unique: true })
db.tables.createIndex({ status: 1 })

// menuitems
db.menuitems.createIndex({ category: 1 })
db.menuitems.createIndex({ isAvailable: 1 })

// orders
db.orders.createIndex({ tableId: 1 })
db.orders.createIndex({ waiterId: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ createdAt: -1 })

// payments
db.payments.createIndex({ orderId: 1 }, { unique: true })
db.payments.createIndex({ status: 1 })
```

## 🚀 Datos Iniciales (Seed)

Puedes cargar datos de prueba ejecutando en MongoDB:

```javascript
// Crear usuarios de prueba
db.users.insertMany([
  {
    name: "Admin Principal",
    email: "admin@comandas.com",
    password: "$2a$10$...", // hashed password
    role: "ADMIN",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mesero Juan",
    email: "mesero@comandas.com",
    password: "$2a$10$...",
    role: "WAITER",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Chef María",
    email: "chef@comandas.com",
    password: "$2a$10$...",
    role: "CHEF",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

## 🔗 Integración con Spring Boot

En tu backend Spring Boot, usa estas dependencias:

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

Configuración en `application.properties`:

```properties
spring.data.mongodb.uri=${MONGODB_URI}
spring.data.mongodb.database=comandas-restaurant
```

## 📱 Verificar Conexión

Una vez configurado, verifica que todo funcione:

1. Inicia tu backend Spring Boot
2. Revisa los logs para confirmar la conexión
3. Las colecciones se crearán automáticamente al guardar datos
4. Usa MongoDB Compass para visualizar los datos

## 🛠️ Herramientas Útiles

- **MongoDB Compass**: GUI oficial para MongoDB
  - [Descargar aquí](https://www.mongodb.com/try/download/compass)
  
- **Studio 3T**: Herramienta avanzada para MongoDB
  - [Descargar aquí](https://studio3t.com/)

## 📞 Soporte

Si tienes problemas:
1. Verifica que MongoDB esté corriendo
2. Confirma que el connection string esté correcto
3. Revisa que el firewall permita conexiones
4. Verifica las credenciales de acceso

---

**¡Configuración completa!** Tu sistema de comandas ahora puede conectarse a MongoDB para almacenar todos los datos de forma persistente y escalable.
