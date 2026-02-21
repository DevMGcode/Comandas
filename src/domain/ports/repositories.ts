// Ports (interfaces) para la arquitectura hexagonal
// Estos definen los contratos que deben implementar los adaptadores

import { User } from '../entities/User';
import { Table } from '../entities/Table';
import { MenuItem } from '../entities/MenuItem';
import { Order } from '../entities/Order';
import { Payment } from '../entities/Payment';
import { UserRole, OrderStatus, TableStatus } from '../types';

// ===== User Repository =====
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByRole(role: UserRole): Promise<User[]>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

// ===== Table Repository =====
export interface ITableRepository {
  findById(id: string): Promise<Table | null>;
  findAll(): Promise<Table[]>;
  findByStatus(status: TableStatus): Promise<Table[]>;
  findByNumber(number: number): Promise<Table | null>;
  save(table: Table): Promise<Table>;
  update(table: Table): Promise<Table>;
  delete(id: string): Promise<void>;
}

// ===== MenuItem Repository =====
export interface IMenuItemRepository {
  findById(id: string): Promise<MenuItem | null>;
  findAll(): Promise<MenuItem[]>;
  findAvailable(): Promise<MenuItem[]>;
  findByCategory(category: string): Promise<MenuItem[]>;
  save(menuItem: MenuItem): Promise<MenuItem>;
  update(menuItem: MenuItem): Promise<MenuItem>;
  delete(id: string): Promise<void>;
}

// ===== Order Repository =====
export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
  findByTable(tableId: string): Promise<Order[]>;
  findByWaiter(waiterId: string): Promise<Order[]>;
  findActive(): Promise<Order[]>;
  save(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
}

// ===== Payment Repository =====
export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findByOrder(orderId: string): Promise<Payment | null>;
  findAll(): Promise<Payment[]>;
  save(payment: Payment): Promise<Payment>;
  update(payment: Payment): Promise<Payment>;
}

// ===== WebSocket Service =====
export interface IWebSocketService {
  connect(): void;
  disconnect(): void;
  emit(event: string, data: unknown): void;
  on(event: string, callback: (data: unknown) => void): void;
  off(event: string, callback?: (data: unknown) => void): void;
}

// ===== Authentication Service =====
export interface IAuthService {
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): boolean;
}

// ===== Notification Service =====
export interface INotificationService {
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
}
