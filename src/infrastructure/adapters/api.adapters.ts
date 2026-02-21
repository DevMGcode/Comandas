// API Adapters para conectar con Spring Boot + MongoDB

import { apiClient } from '../api/client';
import { IOrderRepository, ITableRepository, IMenuItemRepository, IPaymentRepository, IUserRepository } from '@domain/ports/repositories';
import { Order } from '@domain/entities/Order';
import { OrderItem } from '@domain/entities/OrderItem';
import { Table } from '@domain/entities/Table';
import { MenuItem } from '@domain/entities/MenuItem';
import { Payment } from '@domain/entities/Payment';
import { User } from '@domain/entities/User';
import { OrderStatus, TableStatus } from '@domain/types';
import { OrderSchema, TableSchema, MenuItemSchema, PaymentSchema, UserSchema } from '../database/schemas';

// Helper functions para convertir entre schemas de MongoDB y entidades de dominio
const mapOrderSchemaToEntity = (schema: OrderSchema): Order => {
  const items = schema.items.map(
    item =>
      new OrderItem(
        item._id,
        item.menuItemId,
        item.menuItemName,
        item.quantity,
        item.unitPrice,
        item.notes,
        new Date(item.createdAt)
      )
  );

  return new Order(
    schema._id,
    schema.tableId,
    schema.waiterId,
    items,
    schema.status as OrderStatus,
    schema.notes,
    new Date(schema.createdAt),
    new Date(schema.updatedAt),
    schema.confirmedAt ? new Date(schema.confirmedAt) : null,
    schema.deliveredAt ? new Date(schema.deliveredAt) : null
  );
};

const mapTableSchemaToEntity = (schema: TableSchema): Table => {
  return new Table(
    schema._id,
    schema.number,
    schema.capacity,
    schema.status as TableStatus,
    schema.currentOrderId,
    schema.location,
    new Date(schema.createdAt),
    new Date(schema.updatedAt)
  );
};

const mapMenuItemSchemaToEntity = (schema: MenuItemSchema): MenuItem => {
  return new MenuItem(
    schema._id,
    schema.name,
    schema.description,
    schema.price,
    schema.category as any,
    schema.imageUrl,
    schema.isAvailable,
    schema.preparationTime,
    schema.ingredients,
    new Date(schema.createdAt),
    new Date(schema.updatedAt)
  );
};

const mapPaymentSchemaToEntity = (schema: PaymentSchema): Payment => {
  return new Payment(
    schema._id,
    schema.orderId,
    schema.amount,
    schema.method as any,
    schema.status as any,
    schema.paidAmount,
    new Date(schema.createdAt),
    new Date(schema.updatedAt),
    schema.paidAt ? new Date(schema.paidAt) : null
  );
};

const mapUserSchemaToEntity = (schema: UserSchema): User => {
  return new User(
    schema._id,
    schema.name,
    schema.email,
    schema.role as any,
    schema.isActive,
    new Date(schema.createdAt),
    new Date(schema.updatedAt)
  );
};

// ===== API Repository Implementations =====

export class ApiOrderRepository implements IOrderRepository {
  async findById(id: string): Promise<Order | null> {
    try {
      const { data } = await apiClient.get<OrderSchema>(`/orders/${id}`);
      return mapOrderSchemaToEntity(data);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Order[]> {
    const { data } = await apiClient.get<OrderSchema[]>('/orders');
    return data.map(mapOrderSchemaToEntity);
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const { data } = await apiClient.get<OrderSchema[]>(`/orders?status=${status}`);
    return data.map(mapOrderSchemaToEntity);
  }

  async findByTable(tableId: string): Promise<Order[]> {
    const { data } = await apiClient.get<OrderSchema[]>(`/orders?tableId=${tableId}`);
    return data.map(mapOrderSchemaToEntity);
  }

  async findByWaiter(waiterId: string): Promise<Order[]> {
    const { data } = await apiClient.get<OrderSchema[]>(`/orders?waiterId=${waiterId}`);
    return data.map(mapOrderSchemaToEntity);
  }

  async findActive(): Promise<Order[]> {
    const { data } = await apiClient.get<OrderSchema[]>('/orders/active');
    return data.map(mapOrderSchemaToEntity);
  }

  async save(order: Order): Promise<Order> {
    const { data } = await apiClient.post<OrderSchema>('/orders', {
      tableId: order.tableId,
      waiterId: order.waiterId,
      items: order.items.map(item => ({
        menuItemId: item.menuItemId,
        menuItemName: item.menuItemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
      })),
      notes: order.notes,
    });
    return mapOrderSchemaToEntity(data);
  }

  async update(order: Order): Promise<Order> {
    const { data } = await apiClient.put<OrderSchema>(`/orders/${order.id}`, {
      status: order.status,
      items: order.items,
      notes: order.notes,
    });
    return mapOrderSchemaToEntity(data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/orders/${id}`);
  }
}

export class ApiTableRepository implements ITableRepository {
  async findById(id: string): Promise<Table | null> {
    try {
      const { data } = await apiClient.get<TableSchema>(`/tables/${id}`);
      return mapTableSchemaToEntity(data);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Table[]> {
    const { data } = await apiClient.get<TableSchema[]>('/tables');
    return data.map(mapTableSchemaToEntity);
  }

  async findByStatus(status: TableStatus): Promise<Table[]> {
    const { data } = await apiClient.get<TableSchema[]>(`/tables?status=${status}`);
    return data.map(mapTableSchemaToEntity);
  }

  async findByNumber(number: number): Promise<Table | null> {
    try {
      const { data } = await apiClient.get<TableSchema>(`/tables/number/${number}`);
      return mapTableSchemaToEntity(data);
    } catch (error) {
      return null;
    }
  }

  async save(table: Table): Promise<Table> {
    const { data } = await apiClient.post<TableSchema>('/tables', {
      number: table.number,
      capacity: table.capacity,
      location: table.location,
    });
    return mapTableSchemaToEntity(data);
  }

  async update(table: Table): Promise<Table> {
    const { data } = await apiClient.put<TableSchema>(`/tables/${table.id}`, {
      capacity: table.capacity,
      status: table.status,
      currentOrderId: table.currentOrderId,
      location: table.location,
    });
    return mapTableSchemaToEntity(data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/tables/${id}`);
  }
}

export class ApiMenuItemRepository implements IMenuItemRepository {
  async findById(id: string): Promise<MenuItem | null> {
    try {
      const { data } = await apiClient.get<MenuItemSchema>(`/menu-items/${id}`);
      return mapMenuItemSchemaToEntity(data);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<MenuItem[]> {
    const { data } = await apiClient.get<MenuItemSchema[]>('/menu-items');
    return data.map(mapMenuItemSchemaToEntity);
  }

  async findAvailable(): Promise<MenuItem[]> {
    const { data } = await apiClient.get<MenuItemSchema[]>('/menu-items?available=true');
    return data.map(mapMenuItemSchemaToEntity);
  }

  async findByCategory(category: string): Promise<MenuItem[]> {
    const { data } = await apiClient.get<MenuItemSchema[]>(`/menu-items?category=${category}`);
    return data.map(mapMenuItemSchemaToEntity);
  }

  async save(item: MenuItem): Promise<MenuItem> {
    const { data } = await apiClient.post<MenuItemSchema>('/menu-items', {
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      preparationTime: item.preparationTime,
      ingredients: item.ingredients,
    });
    return mapMenuItemSchemaToEntity(data);
  }

  async update(item: MenuItem): Promise<MenuItem> {
    const { data } = await apiClient.put<MenuItemSchema>(`/menu-items/${item.id}`, {
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime,
      ingredients: item.ingredients,
    });
    return mapMenuItemSchemaToEntity(data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/menu-items/${id}`);
  }
}

export class ApiPaymentRepository implements IPaymentRepository {
  async findById(id: string): Promise<Payment | null> {
    try {
      const { data } = await apiClient.get<PaymentSchema>(`/payments/${id}`);
      return mapPaymentSchemaToEntity(data);
    } catch (error) {
      return null;
    }
  }

  async findByOrder(orderId: string): Promise<Payment | null> {
    try {
      const { data } = await apiClient.get<PaymentSchema>(`/payments/order/${orderId}`);
      return mapPaymentSchemaToEntity(data);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Payment[]> {
    const { data } = await apiClient.get<PaymentSchema[]>('/payments');
    return data.map(mapPaymentSchemaToEntity);
  }

  async save(payment: Payment): Promise<Payment> {
    const { data } = await apiClient.post<PaymentSchema>('/payments', {
      orderId: payment.orderId,
      amount: payment.amount,
      method: payment.method,
    });
    return mapPaymentSchemaToEntity(data);
  }

  async update(payment: Payment): Promise<Payment> {
    const { data } = await apiClient.put<PaymentSchema>(`/payments/${payment.id}`, {
      status: payment.status,
      paidAmount: payment.paidAmount,
    });
    return mapPaymentSchemaToEntity(data);
  }
}

export class ApiUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const { data } = await apiClient.get<UserSchema>(`/users/${id}`);
      return mapUserSchemaToEntity(data);
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const { data } = await apiClient.get<UserSchema>(`/users/email/${email}`);
      return mapUserSchemaToEntity(data);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    const { data } = await apiClient.get<UserSchema[]>('/users');
    return data.map(mapUserSchemaToEntity);
  }

  async findByRole(role: any): Promise<User[]> {
    const { data } = await apiClient.get<UserSchema[]>(`/users?role=${role}`);
    return data.map(mapUserSchemaToEntity);
  }

  async save(user: User): Promise<User> {
    const { data } = await apiClient.post<UserSchema>('/users', {
      name: user.name,
      email: user.email,
      role: user.role,
    });
    return mapUserSchemaToEntity(data);
  }

  async update(user: User): Promise<User> {
    const { data } = await apiClient.put<UserSchema>(`/users/${user.id}`, {
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    });
    return mapUserSchemaToEntity(data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }
}

// Export instances
export const apiOrderRepository = new ApiOrderRepository();
export const apiTableRepository = new ApiTableRepository();
export const apiMenuItemRepository = new ApiMenuItemRepository();
export const apiPaymentRepository = new ApiPaymentRepository();
export const apiUserRepository = new ApiUserRepository();
