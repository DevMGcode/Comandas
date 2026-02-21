# 🍽️ Comandas Restaurant - Sistema de Gestión

Sistema revolucionario de gestión de comandas para restaurantes con arquitectura hexagonal, diseño futurístico y actualizaciones en tiempo real.

## ✨ Características Principales

- **🏗️ Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **⚛️ React + TypeScript**: Base sólida y type-safe
- **🎨 Tailwind CSS**: Diseño futurístico y minimalista con glass morphism
- **⚡ Tiempo Real**: Actualizaciones instantáneas con WebSocket
- **👥 Multi-perfil**: Administrador, Mesero y Cocinero con permisos específicos
- **📊 MongoDB**: Base de datos NoSQL escalable
- **🔄 Flujo Automático**: Auto-confirmación de pedidos y auto-liberación de mesas
- **📖 Menú Dinámico**: Gestión del menú del día con precios y disponibilidad editables
- **🍽️ Vista Cocina Kanban**: Tres columnas (Nuevos → En Preparación → Listos)
- **🔐 Login Simplificado**: Usuario/contraseña con acceso rápido por rol
- **📱 Responsive**: Funciona perfectamente en desktop, tablet y móvil

## 🎯 Funcionalidades

### Para Administradores 👨‍💼
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión completa de mesas (crear, eliminar, editar, cambiar estado)
- ✅ Administración del menú del día (crear, editar, eliminar, cambiar precios, disponibilidad)
- ✅ Vista de todos los pedidos y su estado
- ✅ Entregar pedidos listos (auto-libera mesas)
- ✅ Control total del restaurante

### Para Meseros 🧑‍🍳
- ✅ Vista de mesas con estados (disponible, ocupada, limpieza)
- ✅ Crear nuevos pedidos (auto-confirmados para cocina)
- ✅ Administración del menú del día (precios y disponibilidad)
- ✅ Gestionar pedidos activos en el dashboard
- ✅ Entregar pedidos listos (auto-libera mesa para limpieza)
- ✅ Liberar mesas después de limpieza

### Para Cocineros 👨‍🍳
- ✅ Vista de cocina tipo Kanban (3 columnas)
- ✅ Pedidos confirmados → En preparación → Listos
- ✅ Ver detalles completos de cada pedido
- ✅ Cambiar estado de pedidos con un clic
- ✅ Notificaciones en tiempo real

## 📁 Estructura del Proyecto (Arquitectura Hexagonal)

```
src/
├── domain/                    # Capa de Dominio (Núcleo del negocio)
│   ├── entities/             # Entidades del dominio
│   │   ├── User.ts
│   │   ├── Table.ts
│   │   ├── MenuItem.ts
│   │   ├── Order.ts
│   │   ├── OrderItem.ts
│   │   └── Payment.ts
│   ├── value-objects/        # Objetos de valor
│   ├── ports/                # Interfaces (contratos)
│   │   └── repositories.ts
│   └── types.ts              # Tipos y enums del dominio
│
├── application/              # Capa de Aplicación (Casos de uso)
│   └── use-cases/
│       ├── order.use-cases.ts
│       ├── table.use-cases.ts
│       ├── menu.use-cases.ts
│       └── payment.use-cases.ts
│
├── infrastructure/           # Capa de Infraestructura (Implementaciones)
│   ├── adapters/            # Adaptadores para servicios externos
│   │   └── api.adapters.ts
│   ├── api/                 # Cliente HTTP
│   │   └── client.ts
│   ├── database/            # Schemas de MongoDB
│   │   └── schemas.ts
│   ├── websocket/           # WebSocket service
│   │   └── service.ts
│   ├── repositories/        # Repositorios mock (desarrollo)
│   └── services/            # Servicios de infraestructura
│       └── notification.service.ts
│
└── presentation/            # Capa de Presentación (UI)
    ├── components/
    │   ├── ui/              # Componentes reutilizables
    │   ├── layout/          # Layout y navegación
    │   ├── modals/          # Modales
    │   └── auth/            # Componentes de autenticación
    ├── pages/               # Páginas de la aplicación
    │   ├── LoginPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── TablesPage.tsx
    │   ├── KitchenPage.tsx
    │   └── MenuManagementPage.tsx
    ├── stores/              # Estado global (Zustand)
    │   ├── auth.store.ts
    │   ├── order.store.ts
    │   ├── table.store.ts
    │   └── menu.store.ts
    └── hooks/               # Hooks personalizados
```

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura tus variables:

```bash
cp .env.example .env
```

Edita `.env`:
```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080
VITE_MONGODB_URI=mongodb://localhost:27017/comandas-restaurant
```

### 3. Configurar MongoDB

Consulta [MONGODB_SETUP.md](./MONGODB_SETUP.md) para instrucciones detalladas sobre:
- Configuración de MongoDB Atlas (nube)
- Instalación de MongoDB local
- Estructura de colecciones
- Índices recomendados

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 5. Usuarios de Prueba (Modo Mock)

El sistema usa login simplificado con **usuario y contraseña**:

- **Admin**: 
  - Usuario: `admin`
  - Contraseña: `admin`
  - Acceso completo a todas las funciones

- **Mesero**: 
  - Usuario: `mesero`
  - Contraseña: `mesero`
  - Gestión de mesas, pedidos y menú

- **Chef**: 
  - Usuario: `chef`
  - Contraseña: `chef`
  - Vista de cocina y control de preparación

> 💡 **Tip**: En la página de login hay botones de acceso rápido para cada rol

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build           # Construir para producción
npm run preview         # Preview del build

# Calidad de Código
npm run lint            # Ejecutar ESLint
npm test                # Ejecutar tests
npm run test:ui         # Tests con interfaz visual
```

## � Flujo Completo del Sistema

### 1️⃣ Login
1. Usuario ingresa **username** y **password** (ej: `admin` / `admin`)
2. O usa botones de acceso rápido para cada rol
3. Sistema valida credenciales y carga perfil correspondiente

### 2️⃣ Gestión del Menú del Día (Admin/Mesero)
1. Ir a sección **"Menú del Día"** 📖
2. Ver platos organizados por categorías:
   - 🥗 Entradas
   - 🍽️ Platos Principales
   - 🍰 Postres
   - 🥤 Bebidas
   - ⭐ Especiales
3. **Crear nuevo plato**: Botón "+ Nuevo Plato"
   - Ingresar nombre, descripción, precio
   - Seleccionar categoría y tiempo de preparación
   - Agregar imagen (URL) e ingredientes
4. **Editar plato existente**: Botón "Editar" ✏️
   - Cambiar cualquier dato (nombre, precio, categoría, etc.)
5. **Cambiar disponibilidad**: Clic en badge de estado
   - Toggle entre "Disponible" 👁️ y "No Disponible" 👁️‍🗨️
6. **Eliminar plato**: Botón 🗑️

### 3️⃣ Gestión de Mesas (Admin/Mesero)
1. Ir a sección **"Mesas"**
2. Ver mesas organizadas por ubicación:
   - **Salón Principal** (azul)
   - **Terraza** (verde)
   - **VIP** (púrpura)
3. Estados de mesa:
   - 🟢 **Disponible** - Lista para clientes
   - 🟡 **Ocupada** - Con pedido activo
   - 🧹 **Limpieza** - Después de entrega
4. **Crear nueva mesa** (Solo Admin):
   - Botón "+ Nueva Mesa" en la parte superior
   - Ingresar número único, capacidad (2/4/6/8), ubicación (main/terrace/vip)
   - Sistema valida que no exista duplicado
5. **Eliminar mesa** (Solo Admin):
   - Botón 🗑️ en esquina superior derecha de cada mesa
   - Solo visible en mesas **disponibles** 🟢
   - Confirmación antes de eliminar
   - ⛔ No se pueden eliminar mesas ocupadas o en limpieza
6. **Limpiar mesa**: Clic en "Marcar como Disponible"

### 4️⃣ Crear Pedido (Admin/Mesero)
1. En vista de **Mesas**, clic en mesa disponible
2. Botón **"Nuevo Pedido"**
3. Modal con menú disponible:
   - Filtrar por categorías
   - Ver precios y descripciones
   - Agregar platos al carrito
   - Ajustar cantidades
4. Agregar notas especiales (opcional)
5. Clic en **"Confirmar Pedido"**
6. ✨ **Automático**: 
   - Mesa cambia a estado "Ocupada" 🟡
   - Pedido se confirma automáticamente
   - Aparece instantáneamente en cocina

### 5️⃣ Cocina - Preparación (Chef/Admin)
1. Ir a sección **"Cocina"** 👨‍🍳
2. Vista Kanban con 3 columnas:
   - 📋 **Nuevos** (CONFIRMED): Pedidos recién llegados
   - 🔥 **En Preparación** (PREPARING): En proceso
   - ✅ **Listos** (READY): Terminados para servir
3. **Iniciar preparación**:
   - Clic en "Preparar" en columna "Nuevos"
   - Pedido pasa a "En Preparación"
4. **Marcar como listo**:
   - Clic en "Listo" en columna "En Preparación"
   - Pedido pasa a "Listos"

### 6️⃣ Entregar Pedido (Admin/Mesero)
1. En **Dashboard**, sección **"Listos para Servir"** (verde)
2. Ver todos los pedidos READY con sus platos
3. Clic en **"Entregar a Mesa"** 🎯
4. ✨ **Automático**:
   - Pedido cambia a estado "Entregado"
   - Mesa se libera automáticamente a "Limpieza" 🧹
   - Aparece en "Pedidos Entregados" (azul)
5. Mesero limpia mesa física
6. Clic en **"Marcar como Disponible"** en la mesa
7. Mesa queda lista para nuevos clientes 🟢

### 🔄 Ciclo Completo

```
1. Mesa DISPONIBLE 🟢
   ↓
2. Crear Pedido → Mesa OCUPADA 🟡
   ↓
3. Pedido auto-confirmado → Aparece en COCINA
   ↓
4. Chef: Preparar → EN PREPARACIÓN 🔥
   ↓
5. Chef: Listo → READY ✅
   ↓
6. Mesero: Entregar → Mesa LIMPIEZA 🧹 (automático)
   ↓
7. Mesero: Limpiar → Mesa DISPONIBLE 🟢
```

## 🔌 Conexión con Backend Spring Boot

El frontend está preparado para conectarse con un backend Spring Boot + MongoDB.

### Endpoints de API Esperados

Consulta [API_ENDPOINTS.md](./API_ENDPOINTS.md) para la documentación completa de endpoints.

Ejemplos principales:

#### Autenticación
- `POST /api/auth/login` - Login con username/password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuario actual

#### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Crear pedido (auto-confirma)
- `PUT /api/orders/:id/status` - Cambiar estado
- `GET /api/orders/active` - Pedidos activos
- `PUT /api/orders/:id/deliver` - Entregar (auto-libera mesa)

#### Mesas
- `GET /api/tables` - Listar mesas
- `POST /api/tables` - Crear mesa
- `PUT /api/tables/:id` - Actualizar mesa
- `DELETE /api/tables/:id` - Eliminar mesa (solo disponibles)
- `PUT /api/tables/:id/free` - Liberar mesa

#### Menú
- `GET /api/menu-items` - Listar items del menú
- `GET /api/menu-items/available` - Items disponibles
- `POST /api/menu-items` - Crear item
- `PUT /api/menu-items/:id` - Actualizar item
- `DELETE /api/menu-items/:id` - Eliminar item
- `PUT /api/menu-items/:id/toggle-availability` - Cambiar disponibilidad

### WebSocket Events

El sistema usa WebSocket para actualizaciones en tiempo real:

```javascript
// Eventos emitidos por el servidor
'order:created'      - Nuevo pedido creado
'order:confirmed'    - Pedido confirmado (auto, al crear)
'order:preparing'    - Pedido en preparación
'order:ready'        - Pedido listo para servir
'order:delivered'    - Pedido entregado a mesa
'table:created'      - Nueva mesa creada
'table:updated'      - Mesa actualizada
'table:freed'        - Mesa liberada (auto, al entregar)
'table:deleted'      - Mesa eliminada
'menuItem:created'   - Nuevo plato agregado
'menuItem:updated'   - Plato modificado
'menuItem:availabilityChanged' - Disponibilidad cambiada
'menuItem:deleted'   - Plato eliminado
```

### Estado Inicial

El sistema **inicia limpio** (sin datos de ejemplo):
- ✅ 12 mesas predefinidas (4×2personas, 4×4personas, 4×6personas)
- ✅ Todas las mesas en estado DISPONIBLE
- ✅ Sin pedidos activos
- ✅ Menú vacío (admin/mesero deben agregar platos)

Esto permite configurar el sistema según las necesidades específicas de cada restaurante.

## 📊 Base de Datos MongoDB

### ¿Por qué MongoDB?

1. **Flexibilidad**: Schema dinámico para adaptarse a cambios
2. **Rendimiento**: Excelente para operaciones de lectura/escritura concurrentes
3. **Escalabilidad**: Fácil escalado horizontal
4. **Documentos**: Estructura natural para órdenes con items anidados
5. **Tiempo Real**: Ideal para aplicaciones con actualizaciones frecuentes

### Colecciones Principales

- `users` - Usuarios del sistema (admin, mesero, chef)
- `tables` - Mesas del restaurante con estados (disponible, ocupada, limpieza, reservada)
- `menuitems` - Elementos del menú con precios y disponibilidad dinámica
- `orders` - Pedidos con items anidados y flujo automático de estados
- `payments` - Pagos asociados a pedidos (preparado para implementación futura)

Ver [MONGODB_SETUP.md](./MONGODB_SETUP.md) para detalles completos del esquema y configuración.

## 🎨 Tecnologías

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Animaciones
- **Zustand** - Gestión de estado
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Socket.io Client** - WebSocket
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones
- **date-fns** - Utilidades de fecha

### Backend Recomendado
- **Spring Boot 3** - Framework Java
- **Spring Data MongoDB** - ODM para MongoDB
- **Spring WebSocket** - WebSocket support
- **Spring Security** - Autenticación y autorización
- **JWT** - Tokens de autenticación

## 🏗️ Principios de Arquitectura Hexagonal

### Ventajas

1. **Independencia de frameworks**: El dominio no depende de tecnologías específicas
2. **Testabilidad**: Casos de uso fáciles de probar aisladamente
3. **Mantenibilidad**: Cambios en infraestructura no afectan la lógica de negocio
4. **Escalabilidad**: Fácil agregar nuevos adaptadores o casos de uso
5. **Flexibilidad**: Cambio rápido entre mock repositories y API real

### Decisiones de Diseño

#### 🚀 Auto-confirmación de Pedidos
Los pedidos se confirman automáticamente al crearse, eliminando un paso innecesario:
- ✅ Mesero crea pedido → Aparece inmediatamente en cocina
- ✅ Reduce clics y tiempo de respuesta
- ✅ Flujo más natural y eficiente

#### 🔄 Auto-liberación de Mesas
Al entregar un pedido, la mesa pasa automáticamente a "Limpieza":
- ✅ Un solo clic para entregar y liberar
- ✅ Previene olvidos de liberar mesas
- ✅ Optimiza rotación de mesas
- ✅ Mesero solo marca "Disponible" después de limpiar físicamente

#### 📖 Menú Dinámico
Gestión flexible del menú del día:
- ✅ Cambiar precios en cualquier momento
- ✅ Marcar platos como no disponibles (agotados)
- ✅ Diferentes menús por restaurante/día
- ✅ Actualización en tiempo real

#### 🔐 Login Simplificado
Usuario y contraseña en lugar de email:
- ✅ Más simple: `admin`/`admin` vs `admin@comandas.com`
- ✅ Botones de acceso rápido por rol
- ✅ Credenciales visibles para desarrollo

#### 🎯 Estado Inicial Limpio
Sin datos de ejemplo, listo para producción:
- ✅ 12 mesas predefinidas todas disponibles
- ✅ Menú vacío (admin configura según necesidad)
- ✅ Sin pedidos de prueba confusos

#### 🪑 Gestión Dinámica de Mesas
Crear y eliminar mesas según necesidades del restaurante:
- ✅ **Crear mesas**: Admin puede agregar mesas dinámicamente con número único, capacidad y ubicación
- ✅ **Eliminar mesas**: Solo admin puede eliminar mesas disponibles (no ocupadas)
- ✅ **Validaciones**: Previene eliminar mesas con pedidos activos o en uso
- ✅ **Confirmación**: Requiere confirmación explícita antes de eliminar
- ✅ **Flexibilidad**: Adapta el sistema a cambios en distribución del local
- ✅ **Seguridad**: Solo mesas disponibles 🟢 muestran botón de eliminar

### Flujo de Datos

```
Usuario interactúa con UI (Presentation)
  ↓
Componente envía acción a Store (Zustand)
  ↓
Store invoca Use Case (Application)
  ↓
Use Case usa Repository (Port/Interface)
  ↓
Adapter implementa Repository (Infrastructure)
  ↓
API/Database responde
  ↓
Resultado fluye de vuelta actualizando UI
```

### Ejemplo: Crear Pedido

1. **Presentación**: Usuario llena formulario en `CreateOrderModal`
2. **Store**: `useOrderStore.createOrder()` es llamado
3. **Caso de Uso**: `CreateOrderUseCase.execute()` valida y crea el pedido
4. **Dominio**: `Order` entity con lógica de negocio (auto-confirma)
5. **Repositorio**: `IOrderRepository.save()` persiste datos
6. **Infraestructura**: `mockOrderRepository` (o API adapter) guarda
7. **WebSocket**: `wsService.emit('order:created')` notifica
8. **UI**: Estado actualizado, vista de cocina recibe pedido

## 🔐 Seguridad

- Autenticación con JWT
- Protección de rutas por rol
- Validación de datos en frontend y backend
- Sanitización de inputs
- CORS configurado
- Passwords hasheados (bcrypt)

## 📱 Responsive Design

La aplicación es completamente responsive:
- **Desktop**: Layout con sidebar fijo, tarjetas en grid
- **Tablet**: Layout adaptativo con 2 columnas
- **Mobile**: Menú hamburguesa, diseño optimizado a 1 columna

## ⏭️ Características Pendientes

### En Desarrollo
- 💳 **Sistema de Pagos**: Procesar pagos y generar recibos
- 👤 **Gestión de Usuarios**: Admin puede crear/editar usuarios
- 📊 **Reportes y Analytics**: Estadísticas de ventas, platos populares, tiempos promedio
- 📝 **Sistema de Reservas**: Reservar mesas con anticipación
- 📦 **Inventario**: Control de stock de ingredientes
- 🖨️ **Impresión**: Comandas y tickets de cocina

### Backend
- 🔧 **API REST Spring Boot**: Implementación completa de endpoints
- 🔌 **WebSocket Real**: Notificaciones en tiempo real
- 🔐 **JWT Authentication**: Tokens seguros
- 📧 **Notificaciones**: Email/SMS para reservas y actualizaciones

### Mejoras UX
- 🌙 **Modo Oscuro/Claro**: Toggle de tema
- 🌍 **Internacionalización**: Múltiples idiomas
- 🔔 **Notificaciones Push**: Alertas del navegador
- 📸 **Upload de Imágenes**: Subir fotos de platos directamente

## 🚀 Despliegue

### Frontend

```bash
# Build
npm run build

# Los archivos estarán en /dist
```

Puedes desplegar en:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Cualquier servidor estático

### Backend

El backend Spring Boot puede desplegarse en:
- Heroku
- AWS (EC2, ECS, Elastic Beanstalk)
- Google Cloud Platform
- Azure
- Docker containers

### MongoDB

Opciones de hosting:
- **MongoDB Atlas** (recomendado) - Managed service
- **AWS DocumentDB**
- **Azure Cosmos DB**
- Servidor propio

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 🎓 Guía Rápida de Uso

### Primera Vez
1. `npm install` - Instalar dependencias
2. `npm run dev` - Iniciar aplicación
3. Login con `admin`/`admin`
4. Ir a "Menú del Día" → Agregar platos
5. Ir a "Mesas" → Ver mesas disponibles
6. Crear primer pedido en una mesa
7. Ir a "Cocina" → Ver y procesar pedido
8. En "Dashboard" → Entregar pedido

### Flujo Diario
1. **Configurar menú del día** (Admin/Mesero)
   - Actualizar precios, disponibilidad
2. **Recibir clientes** (Mesero)
   - Crear pedido en mesa
3. **Preparar comida** (Chef)
   - Cocina: Preparar → Listo
4. **Servir** (Mesero)
   - Dashboard: Entregar → Limpiar mesa

### Tips
- 💡 Los pedidos aparecen automáticamente en cocina al crearlos
- 💡 Al entregar, la mesa se libera automáticamente a limpieza
- 💡 Usa filtros de categoría en el menú para encontrar platos rápido
- 💡 Vista de cocina se actualiza en tiempo real
- 💡 Solo admin puede crear/eliminar mesas (botón 🗑️ visible solo en mesas disponibles)
- 💡 No se pueden eliminar mesas ocupadas - libéralas primero

## 📞 Soporte

Si tienes preguntas o problemas:
1. Revisa la documentación
2. Consulta los issues existentes
3. Abre un nuevo issue con detalles

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles

---

**Desarrollado con ❤️ usando arquitectura hexagonal y las mejores prácticas de desarrollo**

### 📋 Changelog v1.0.0

#### Implementado ✅
- ✅ Arquitectura hexagonal completa
- ✅ Login simplificado (usuario/password)
- ✅ Gestión completa del menú del día (crear, editar, eliminar, disponibilidad)
- ✅ Auto-confirmación de pedidos
- ✅ Auto-liberación de mesas al entregar
- ✅ Vista de cocina tipo Kanban
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión dinámica de mesas (crear y eliminar con validaciones)
- ✅ Estado inicial limpio (sin seed data)
- ✅ Mock repositories para desarrollo standalone
- ✅ Documentación completa (README, MongoDB Setup, API Endpoints)
- ✅ Diseño futurístico con glass morphism
- ✅ Sistema completamente responsive

#### Preparado para Backend 🔌
- ✅ Adaptadores API listos para Spring Boot
- ✅ WebSocket service configurado
- ✅ Schemas MongoDB definidos
- ✅ Endpoints documentados

---

🚀 **¡Sistema listo para usar en desarrollo o conectar con backend real!**
