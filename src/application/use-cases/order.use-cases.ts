import { Order } from '@domain/entities/Order';
import { OrderItem } from '@domain/entities/OrderItem';
import { IOrderRepository, ITableRepository, IWebSocketService } from '@domain/ports/repositories';

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private tableRepository: ITableRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(
    tableId: string,
    waiterId: string,
    items: Array<{ menuItemId: string; menuItemName: string; quantity: number; unitPrice: number; notes?: string }>
  ): Promise<Order> {
    // Verificar que la mesa existe
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Mesa no encontrada');
    }

    // Crear el pedido
    const orderId = crypto.randomUUID();
    const orderItems = items.map(
      item =>
        new OrderItem(
          crypto.randomUUID(),
          item.menuItemId,
          item.menuItemName,
          item.quantity,
          item.unitPrice,
          item.notes || ''
        )
    );

    const order = new Order(orderId, tableId, waiterId, orderItems);
    
    // Confirmar el pedido automáticamente para que entre a la cocina
    order.confirm();
    
    const savedOrder = await this.orderRepository.save(order);

    // Ocupar la mesa
    table.occupy(orderId);
    await this.tableRepository.update(table);

    // Notificar por WebSocket
    this.wsService.emit('order:created', savedOrder);
    this.wsService.emit('order:confirmed', savedOrder);

    return savedOrder;
  }
}

export class UpdateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(
    orderId: string,
    updates: {
      items?: Array<{ menuItemId: string; menuItemName: string; quantity: number; unitPrice: number; notes?: string }>;
      notes?: string;
    }
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    if (!order.canBeModified()) {
      throw new Error('El pedido no puede ser modificado en su estado actual');
    }

    if (updates.items) {
      order.items = updates.items.map(
        item =>
          new OrderItem(
            crypto.randomUUID(),
            item.menuItemId,
            item.menuItemName,
            item.quantity,
            item.unitPrice,
            item.notes || ''
          )
      );
    }

    if (updates.notes !== undefined) {
      order.notes = updates.notes;
    }

    const updatedOrder = await this.orderRepository.update(order);
    this.wsService.emit('order:updated', updatedOrder);

    return updatedOrder;
  }
}

export class ConfirmOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    order.confirm();
    const confirmedOrder = await this.orderRepository.update(order);

    this.wsService.emit('order:confirmed', confirmedOrder);
    return confirmedOrder;
  }
}

export class StartPreparingOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    order.startPreparing();
    const updatedOrder = await this.orderRepository.update(order);

    this.wsService.emit('order:preparing', updatedOrder);
    return updatedOrder;
  }
}

export class MarkOrderAsReadyUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    order.markAsReady();
    const updatedOrder = await this.orderRepository.update(order);

    this.wsService.emit('order:ready', updatedOrder);
    return updatedOrder;
  }
}

export class DeliverOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private tableRepository: ITableRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    order.deliver();
    const deliveredOrder = await this.orderRepository.update(order);

    // Liberar la mesa automáticamente cuando se entrega el pedido
    const table = await this.tableRepository.findById(order.tableId);
    if (table) {
      table.free();
      await this.tableRepository.update(table);
      this.wsService.emit('table:freed', table);
    }

    this.wsService.emit('order:delivered', deliveredOrder);
    return deliveredOrder;
  }
}

export class CancelOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private tableRepository: ITableRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(orderId: string, reason: string = ''): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    order.cancel(reason);
    const cancelledOrder = await this.orderRepository.update(order);

    // Liberar la mesa
    const table = await this.tableRepository.findById(order.tableId);
    if (table) {
      table.free();
      await this.tableRepository.update(table);
    }

    this.wsService.emit('order:cancelled', cancelledOrder);
    return cancelledOrder;
  }
}

export class GetActiveOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findActive();
  }
}
