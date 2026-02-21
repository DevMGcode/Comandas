// MongoDB Schema Definitions
// Estos schemas están listos para usarse con MongoDB y pueden ser usados directamente en el backend Spring Boot con MongoDB

export interface UserSchema {
  _id: string;
  name: string;
  email: string;
  password?: string; // Hashed password
  role: 'ADMIN' | 'WAITER' | 'CHEF';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TableSchema {
  _id: string;
  number: number;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  currentOrderId: string | null;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemSchema {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'APPETIZER' | 'MAIN_COURSE' | 'DESSERT' | 'BEVERAGE' | 'SPECIAL';
  imageUrl: string | null;
  isAvailable: boolean;
  preparationTime: number; // minutos
  ingredients: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemSchema {
  _id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  notes: string;
  createdAt: Date;
}

export interface OrderSchema {
  _id: string;
  tableId: string;
  waiterId: string;
  items: OrderItemSchema[];
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  notes: string;
  total: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt: Date | null;
  deliveredAt: Date | null;
}

export interface PaymentSchema {
  _id: string;
  orderId: string;
  amount: number;
  method: 'CASH' | 'CARD' | 'DIGITAL';
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED';
  paidAmount: number;
  createdAt: Date;
  updatedAt: Date;
  paidAt: Date | null;
}

export interface ReservationSchema {
  _id: string;
  tableId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  reservationDate: Date;
  guestCount: number;
  notes: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItemSchema {
  _id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  cost: number;
  supplier: string | null;
  lastRestockDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLogSchema {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
  timestamp: Date;
}
