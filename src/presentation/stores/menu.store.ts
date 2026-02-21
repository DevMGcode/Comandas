import { create } from 'zustand';
import { MenuItem } from '@domain/entities/MenuItem';
import { MenuItemCategory } from '@domain/types';
import { mockMenuItemRepository } from '@infrastructure/repositories/mock-menu.repository';
import { wsService } from '@infrastructure/websocket/service';
import {
  GetAllMenuItemsUseCase,
  GetAvailableMenuItemsUseCase,
  CreateMenuItemUseCase,
  UpdateMenuItemUseCase,
  ToggleMenuItemAvailabilityUseCase,
  DeleteMenuItemUseCase,
} from '@application/use-cases/menu.use-cases';

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  
  loadMenuItems: () => Promise<void>;
  loadAllMenuItems: () => Promise<void>;
  createMenuItem: (data: {
    name: string;
    description: string;
    price: number;
    category: MenuItemCategory;
    imageUrl?: string;
    preparationTime?: number;
    ingredients?: string[];
  }) => Promise<MenuItem>;
  updateMenuItem: (id: string, updates: {
    name?: string;
    description?: string;
    price?: number;
    category?: MenuItemCategory;
    imageUrl?: string;
    preparationTime?: number;
    ingredients?: string[];
  }) => Promise<MenuItem>;
  toggleAvailability: (id: string) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
}

const getAllMenuItemsUseCase = new GetAllMenuItemsUseCase(mockMenuItemRepository);
const getAvailableMenuItemsUseCase = new GetAvailableMenuItemsUseCase(mockMenuItemRepository);
const createMenuItemUseCase = new CreateMenuItemUseCase(mockMenuItemRepository, wsService);
const updateMenuItemUseCase = new UpdateMenuItemUseCase(mockMenuItemRepository, wsService);
const toggleMenuItemAvailabilityUseCase = new ToggleMenuItemAvailabilityUseCase(mockMenuItemRepository, wsService);
const deleteMenuItemUseCase = new DeleteMenuItemUseCase(mockMenuItemRepository, wsService);

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  loadMenuItems: async () => {
    set({ loading: true, error: null });
    try {
      const items = await getAvailableMenuItemsUseCase.execute();
      set({ items, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  loadAllMenuItems: async () => {
    set({ loading: true, error: null });
    try {
      const items = await getAllMenuItemsUseCase.execute();
      set({ items, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createMenuItem: async (data) => {
    const menuItem = await createMenuItemUseCase.execute(data);
    set({ items: [...get().items, menuItem] });
    return menuItem;
  },

  updateMenuItem: async (id, updates) => {
    const updatedItem = await updateMenuItemUseCase.execute(id, updates);
    set({
      items: get().items.map(item => item.id === id ? updatedItem : item)
    });
    return updatedItem;
  },

  toggleAvailability: async (id) => {
    const updatedItem = await toggleMenuItemAvailabilityUseCase.execute(id);
    set({
      items: get().items.map(item => item.id === id ? updatedItem : item)
    });
  },

  deleteMenuItem: async (id) => {
    await deleteMenuItemUseCase.execute(id);
    set({
      items: get().items.filter(item => item.id !== id)
    });
  },
}));
