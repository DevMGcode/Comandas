import { TableStatus } from '../types';

export class Table {
  constructor(
    public readonly id: string,
    public number: number,
    public capacity: number,
    public status: TableStatus = TableStatus.AVAILABLE,
    public currentOrderId: string | null = null,
    public location: string = 'main',
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  isAvailable(): boolean {
    return this.status === TableStatus.AVAILABLE;
  }

  isOccupied(): boolean {
    return this.status === TableStatus.OCCUPIED;
  }

  occupy(orderId: string): void {
    if (!this.isAvailable()) {
      throw new Error('La mesa no está disponible');
    }
    this.status = TableStatus.OCCUPIED;
    this.currentOrderId = orderId;
    this.updatedAt = new Date();
  }

  free(): void {
    this.status = TableStatus.CLEANING;
    this.currentOrderId = null;
    this.updatedAt = new Date();
  }

  markAsAvailable(): void {
    this.status = TableStatus.AVAILABLE;
    this.updatedAt = new Date();
  }

  reserve(): void {
    if (!this.isAvailable()) {
      throw new Error('La mesa no está disponible para reservar');
    }
    this.status = TableStatus.RESERVED;
    this.updatedAt = new Date();
  }

  updateCapacity(capacity: number): void {
    if (capacity < 1) {
      throw new Error('La capacidad debe ser mayor a 0');
    }
    this.capacity = capacity;
    this.updatedAt = new Date();
  }
}
