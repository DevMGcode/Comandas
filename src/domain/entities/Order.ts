import { OrderStatus } from '../types';
import { OrderItem } from './OrderItem';

export class Order {
  constructor(
    public readonly id: string,
    public tableId: string,
    public waiterId: string,
    public items: OrderItem[] = [],
    public status: OrderStatus = OrderStatus.PENDING,
    public notes: string = '',
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public confirmedAt: Date | null = null,
    public deliveredAt: Date | null = null
  ) {}

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  get itemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  addItem(item: OrderItem): void {
    const existingItem = this.items.find(i => i.menuItemId === item.menuItemId);
    if (existingItem) {
      existingItem.addQuantity(item.quantity);
    } else {
      this.items.push(item);
    }
    this.updatedAt = new Date();
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter(item => item.id !== itemId);
    this.updatedAt = new Date();
  }

  updateItemQuantity(itemId: string, quantity: number): void {
    const item = this.items.find(i => i.id === itemId);
    if (!item) {
      throw new Error('Item no encontrado');
    }
    item.updateQuantity(quantity);
    this.updatedAt = new Date();
  }

  confirm(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Solo se pueden confirmar pedidos pendientes');
    }
    if (this.items.length === 0) {
      throw new Error('No se puede confirmar un pedido sin items');
    }
    this.status = OrderStatus.CONFIRMED;
    this.confirmedAt = new Date();
    this.updatedAt = new Date();
  }

  startPreparing(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new Error('Solo se pueden preparar pedidos confirmados');
    }
    this.status = OrderStatus.PREPARING;
    this.updatedAt = new Date();
  }

  markAsReady(): void {
    if (this.status !== OrderStatus.PREPARING) {
      throw new Error('Solo se pueden marcar como listos pedidos en preparación');
    }
    this.status = OrderStatus.READY;
    this.updatedAt = new Date();
  }

  deliver(): void {
    if (this.status !== OrderStatus.READY) {
      throw new Error('Solo se pueden entregar pedidos listos');
    }
    this.status = OrderStatus.DELIVERED;
    this.deliveredAt = new Date();
    this.updatedAt = new Date();
  }

  cancel(reason: string = ''): void {
    if (this.status === OrderStatus.DELIVERED) {
      throw new Error('No se puede cancelar un pedido ya entregado');
    }
    this.status = OrderStatus.CANCELLED;
    if (reason) {
      this.notes += `\n[Cancelado: ${reason}]`;
    }
    this.updatedAt = new Date();
  }

  isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  isConfirmed(): boolean {
    return this.status === OrderStatus.CONFIRMED;
  }

  isPreparing(): boolean {
    return this.status === OrderStatus.PREPARING;
  }

  isReady(): boolean {
    return this.status === OrderStatus.READY;
  }

  isDelivered(): boolean {
    return this.status === OrderStatus.DELIVERED;
  }

  isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }

  canBeModified(): boolean {
    return this.status === OrderStatus.PENDING;
  }
}
