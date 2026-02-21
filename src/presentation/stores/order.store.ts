import { create } from 'zustand';
import { Order } from '@domain/entities/Order';
import { mockOrderRepository } from '@infrastructure/repositories/mock-order.repository';
import { mockTableRepository } from '@infrastructure/repositories/mock-table.repository';
import { wsService } from '@infrastructure/websocket/service';
import {
  CreateOrderUseCase,
  ConfirmOrderUseCase,
  StartPreparingOrderUseCase,
  MarkOrderAsReadyUseCase,
  DeliverOrderUseCase,
  CancelOrderUseCase,
  GetActiveOrdersUseCase,
} from '@application/use-cases/order.use-cases';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadActiveOrders: () => Promise<void>;
  createOrder: (tableId: string, waiterId: string, items: any[]) => Promise<void>;
  confirmOrder: (orderId: string) => Promise<void>;
  startPreparing: (orderId: string) => Promise<void>;
  markAsReady: (orderId: string) => Promise<void>;
  deliverOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  selectOrder: (order: Order | null) => void;
}

// Use cases
const getActiveOrdersUseCase = new GetActiveOrdersUseCase(mockOrderRepository);
const createOrderUseCase = new CreateOrderUseCase(mockOrderRepository, mockTableRepository, wsService);
const confirmOrderUseCase = new ConfirmOrderUseCase(mockOrderRepository, wsService);
const startPreparingUseCase = new StartPreparingOrderUseCase(mockOrderRepository, wsService);
const markAsReadyUseCase = new MarkOrderAsReadyUseCase(mockOrderRepository, wsService);
const deliverOrderUseCase = new DeliverOrderUseCase(mockOrderRepository, mockTableRepository, wsService);
const cancelOrderUseCase = new CancelOrderUseCase(mockOrderRepository, mockTableRepository, wsService);

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,

  loadActiveOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await getActiveOrdersUseCase.execute();
      set({ orders, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createOrder: async (tableId, waiterId, items) => {
    set({ loading: true, error: null });
    try {
      await createOrderUseCase.execute(tableId, waiterId, items);
      await get().loadActiveOrders();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  confirmOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      await confirmOrderUseCase.execute(orderId);
      await get().loadActiveOrders();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  startPreparing: async (orderId) => {
    set({ loading: true, error: null });
    try {
      await startPreparingUseCase.execute(orderId);
      await get().loadActiveOrders();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  markAsReady: async (orderId) => {
    set({ loading: true, error: null });
    try {
      await markAsReadyUseCase.execute(orderId);
      await get().loadActiveOrders();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deliverOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      await deliverOrderUseCase.execute(orderId);
      await get().loadActiveOrders();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  cancelOrder: async (orderId, reason) => {
    set({ loading: true, error: null });
    try {
      await cancelOrderUseCase.execute(orderId, reason);
      await get().loadActiveOrders();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  selectOrder: (order) => set({ selectedOrder: order }),
}));
