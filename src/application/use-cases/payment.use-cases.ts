import { Payment } from '@domain/entities/Payment';
import { IPaymentRepository, IOrderRepository, ITableRepository, IWebSocketService } from '@domain/ports/repositories';
import { PaymentMethod } from '@domain/types';

export class CreatePaymentUseCase {
  constructor(
    private paymentRepository: IPaymentRepository,
    private orderRepository: IOrderRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(orderId: string, amount: number, method: PaymentMethod): Promise<Payment> {
    // Verificar que el pedido existe
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    if (!order.isDelivered()) {
      throw new Error('Solo se pueden crear pagos para pedidos entregados');
    }

    // Verificar que no exista un pago para este pedido
    const existingPayment = await this.paymentRepository.findByOrder(orderId);
    if (existingPayment) {
      throw new Error('Ya existe un pago para este pedido');
    }

    const payment = new Payment(crypto.randomUUID(), orderId, amount, method);

    const savedPayment = await this.paymentRepository.save(payment);
    this.wsService.emit('payment:created', savedPayment);

    return savedPayment;
  }
}

export class ProcessPaymentUseCase {
  constructor(
    private paymentRepository: IPaymentRepository,
    private orderRepository: IOrderRepository,
    private tableRepository: ITableRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(paymentId: string, amount: number): Promise<Payment> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Pago no encontrado');
    }

    payment.processPayment(amount);
    const updatedPayment = await this.paymentRepository.update(payment);

    // Si el pago está completado, liberar la mesa
    if (payment.isPaid()) {
      const order = await this.orderRepository.findById(payment.orderId);
      if (order) {
        const table = await this.tableRepository.findById(order.tableId);
        if (table) {
          table.free();
          await this.tableRepository.update(table);
        }
      }
      this.wsService.emit('payment:completed', updatedPayment);
    } else {
      this.wsService.emit('payment:partial', updatedPayment);
    }

    return updatedPayment;
  }
}

export class RefundPaymentUseCase {
  constructor(
    private paymentRepository: IPaymentRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Pago no encontrado');
    }

    payment.refund();
    const refundedPayment = await this.paymentRepository.update(payment);

    this.wsService.emit('payment:refunded', refundedPayment);
    return refundedPayment;
  }
}

export class GetPaymentByOrderUseCase {
  constructor(private paymentRepository: IPaymentRepository) {}

  async execute(orderId: string): Promise<Payment | null> {
    return this.paymentRepository.findByOrder(orderId);
  }
}
