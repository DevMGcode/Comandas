import { PaymentMethod, PaymentStatus } from '../types';

export class Payment {
  constructor(
    public readonly id: string,
    public orderId: string,
    public amount: number,
    public method: PaymentMethod,
    public status: PaymentStatus = PaymentStatus.PENDING,
    public paidAmount: number = 0,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public paidAt: Date | null = null
  ) {
    if (amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }
  }

  get pending(): number {
    return Math.max(0, this.amount - this.paidAmount);
  }

  get change(): number {
    return Math.max(0, this.paidAmount - this.amount);
  }

  isPaid(): boolean {
    return this.status === PaymentStatus.PAID;
  }

  isPartial(): boolean {
    return this.status === PaymentStatus.PARTIAL;
  }

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  processPayment(amount: number): void {
    if (amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    
    this.paidAmount += amount;
    
    if (this.paidAmount >= this.amount) {
      this.status = PaymentStatus.PAID;
      this.paidAt = new Date();
    } else {
      this.status = PaymentStatus.PARTIAL;
    }
    
    this.updatedAt = new Date();
  }

  refund(): void {
    if (!this.isPaid()) {
      throw new Error('Solo se pueden reembolsar pagos completados');
    }
    this.status = PaymentStatus.REFUNDED;
    this.updatedAt = new Date();
  }
}
