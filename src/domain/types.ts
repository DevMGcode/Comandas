// Enums y tipos comunes del dominio

export enum UserRole {
  ADMIN = 'ADMIN',
  WAITER = 'WAITER',
  CHEF = 'CHEF',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  CLEANING = 'CLEANING',
}

export enum MenuItemCategory {
  APPETIZER = 'APPETIZER',
  MAIN_COURSE = 'MAIN_COURSE',
  DESSERT = 'DESSERT',
  BEVERAGE = 'BEVERAGE',
  SPECIAL = 'SPECIAL',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  DIGITAL = 'DIGITAL',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  REFUNDED = 'REFUNDED',
}
