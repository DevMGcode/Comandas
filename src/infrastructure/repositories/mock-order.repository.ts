// Mock repository implementations para desarrollo
// En producción, estos deberían conectarse a tu API Spring Boot

import { Order } from '@domain/entities/Order';
import { OrderItem } from '@domain/entities/OrderItem';
import { IOrderRepository } from '@domain/ports/repositories';
import { OrderStatus } from '@domain/types';

class MockOrderRepository implements IOrderRepository {
  private orders: Map<string, Order> = new Map();

  constructor() {
    // Seed data - Datos de prueba (comentado para comenzar sin datos)
    // Descomenta la línea siguiente si quieres datos de prueba al iniciar
    // this.seedData();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private seedData() {
    // Pedido 1: CONFIRMED - Mesa 1
    const order1Items = [
      new OrderItem('item-1-1', 'menu-1', 'Filete Mignon', 2, 380, 'Término medio'),
      new OrderItem('item-1-2', 'menu-4', 'Cerveza Artesanal', 2, 95, ''),
    ];
    const order1 = new Order(
      'order-1',
      'table-1',
      'waiter-1',
      order1Items,
      OrderStatus.CONFIRMED,
      '',
      new Date(Date.now() - 15 * 60 * 1000), // Hace 15 minutos
      new Date(Date.now() - 15 * 60 * 1000),
      new Date(Date.now() - 10 * 60 * 1000) // Confirmado hace 10 minutos
    );
    this.orders.set(order1.id, order1);

    // Pedido 2: PREPARING - Mesa 2
    const order2Items = [
      new OrderItem('item-2-1', 'menu-2', 'Salmón a la Parrilla', 1, 320, 'Sin sal'),
      new OrderItem('item-2-2', 'menu-3', 'Ensalada César', 1, 180, 'Aderezo aparte'),
      new OrderItem('item-2-3', 'menu-5', 'Agua Mineral', 2, 45, ''),
    ];
    const order2 = new Order(
      'order-2',
      'table-2',
      'waiter-1',
      order2Items,
      OrderStatus.PREPARING,
      '',
      new Date(Date.now() - 25 * 60 * 1000), // Hace 25 minutos
      new Date(Date.now() - 5 * 60 * 1000),
      new Date(Date.now() - 20 * 60 * 1000)
    );
    this.orders.set(order2.id, order2);

    // Pedido 3: READY - Mesa 5
    const order3Items = [
      new OrderItem('item-3-1', 'menu-7', 'Tacos al Pastor', 3, 85, 'Extra picante'),
    ];
    const order3 = new Order(
      'order-3',
      'table-5',
      'waiter-1',
      order3Items,
      OrderStatus.READY,
      'Cliente tiene prisa',
      new Date(Date.now() - 30 * 60 * 1000),
      new Date(Date.now() - 2 * 60 * 1000),
      new Date(Date.now() - 28 * 60 * 1000)
    );
    this.orders.set(order3.id, order3);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.status === status);
  }

  async findByTable(tableId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.tableId === tableId);
  }

  async findByWaiter(waiterId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.waiterId === waiterId);
  }

  async findActive(): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => !order.isDelivered() && !order.isCancelled()
    );
  }

  async save(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }

  async update(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }

  async delete(id: string): Promise<void> {
    this.orders.delete(id);
  }
}

export const mockOrderRepository = new MockOrderRepository();
