import { Payment } from '@domain/entities/Payment';
import { IPaymentRepository } from '@domain/ports/repositories';

class MockPaymentRepository implements IPaymentRepository {
  private payments: Map<string, Payment> = new Map();

  async findById(id: string): Promise<Payment | null> {
    return this.payments.get(id) || null;
  }

  async findByOrder(orderId: string): Promise<Payment | null> {
    return Array.from(this.payments.values()).find(payment => payment.orderId === orderId) || null;
  }

  async findAll(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async save(payment: Payment): Promise<Payment> {
    this.payments.set(payment.id, payment);
    return payment;
  }

  async update(payment: Payment): Promise<Payment> {
    this.payments.set(payment.id, payment);
    return payment;
  }
}

export const mockPaymentRepository = new MockPaymentRepository();
