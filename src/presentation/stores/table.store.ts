import { create } from 'zustand';
import { Table } from '@domain/entities/Table';
import { mockTableRepository } from '@infrastructure/repositories/mock-table.repository';
import { wsService } from '@infrastructure/websocket/service';
import {
  GetAllTablesUseCase,
  CreateTableUseCase,
  FreeTableUseCase,
  MarkTableAsAvailableUseCase,
  DeleteTableUseCase,
} from '@application/use-cases/table.use-cases';

interface TableState {
  tables: Table[];
  selectedTable: Table | null;
  loading: boolean;
  error: string | null;
  
  loadTables: () => Promise<void>;
  createTable: (number: number, capacity: number, location: string) => Promise<void>;
  deleteTable: (tableId: string) => Promise<void>;
  freeTable: (tableId: string) => Promise<void>;
  markAsAvailable: (tableId: string) => Promise<void>;
  selectTable: (table: Table | null) => void;
}

const getAllTablesUseCase = new GetAllTablesUseCase(mockTableRepository);
const createTableUseCase = new CreateTableUseCase(mockTableRepository, wsService);
const deleteTableUseCase = new DeleteTableUseCase(mockTableRepository, wsService);
const freeTableUseCase = new FreeTableUseCase(mockTableRepository, wsService);
const markAsAvailableUseCase = new MarkTableAsAvailableUseCase(mockTableRepository, wsService);

export const useTableStore = create<TableState>((set, get) => ({
  tables: [],
  selectedTable: null,
  loading: false,
  error: null,

  loadTables: async () => {
    set({ loading: true, error: null });
    try {
      const tables = await getAllTablesUseCase.execute();
      set({ tables, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createTable: async (number, capacity, location) => {
    set({ loading: true, error: null });
    try {
      await createTableUseCase.execute(number, capacity, location);
      await get().loadTables();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteTable: async (tableId) => {
    set({ loading: true, error: null });
    try {
      await deleteTableUseCase.execute(tableId);
      await get().loadTables();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  freeTable: async (tableId) => {
    set({ loading: true, error: null });
    try {
      await freeTableUseCase.execute(tableId);
      await get().loadTables();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  markAsAvailable: async (tableId) => {
    set({ loading: true, error: null });
    try {
      await markAsAvailableUseCase.execute(tableId);
      await get().loadTables();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  selectTable: (table) => set({ selectedTable: table }),
}));
