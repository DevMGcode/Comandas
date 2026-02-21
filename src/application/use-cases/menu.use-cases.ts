import { MenuItem } from '@domain/entities/MenuItem';
import { IMenuItemRepository, IWebSocketService } from '@domain/ports/repositories';
import { MenuItemCategory } from '@domain/types';

export class GetAllMenuItemsUseCase {
  constructor(private menuItemRepository: IMenuItemRepository) {}

  async execute(): Promise<MenuItem[]> {
    return this.menuItemRepository.findAll();
  }
}

export class GetAvailableMenuItemsUseCase {
  constructor(private menuItemRepository: IMenuItemRepository) {}

  async execute(): Promise<MenuItem[]> {
    return this.menuItemRepository.findAvailable();
  }
}

export class GetMenuItemsByCategoryUseCase {
  constructor(private menuItemRepository: IMenuItemRepository) {}

  async execute(category: MenuItemCategory): Promise<MenuItem[]> {
    return this.menuItemRepository.findByCategory(category);
  }
}

export class CreateMenuItemUseCase {
  constructor(
    private menuItemRepository: IMenuItemRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(data: {
    name: string;
    description: string;
    price: number;
    category: MenuItemCategory;
    imageUrl?: string;
    preparationTime?: number;
    ingredients?: string[];
  }): Promise<MenuItem> {
    const menuItem = new MenuItem(
      crypto.randomUUID(),
      data.name,
      data.description,
      data.price,
      data.category,
      data.imageUrl || null,
      true,
      data.preparationTime || 15,
      data.ingredients || []
    );

    const savedMenuItem = await this.menuItemRepository.save(menuItem);
    this.wsService.emit('menuItem:created', savedMenuItem);

    return savedMenuItem;
  }
}

export class UpdateMenuItemUseCase {
  constructor(
    private menuItemRepository: IMenuItemRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(
    id: string,
    updates: {
      name?: string;
      description?: string;
      price?: number;
      category?: MenuItemCategory;
      imageUrl?: string;
      preparationTime?: number;
      ingredients?: string[];
    }
  ): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findById(id);
    if (!menuItem) {
      throw new Error('Item de menú no encontrado');
    }

    menuItem.update(updates);
    const updatedMenuItem = await this.menuItemRepository.update(menuItem);

    this.wsService.emit('menuItem:updated', updatedMenuItem);
    return updatedMenuItem;
  }
}

export class ToggleMenuItemAvailabilityUseCase {
  constructor(
    private menuItemRepository: IMenuItemRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(id: string): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findById(id);
    if (!menuItem) {
      throw new Error('Item de menú no encontrado');
    }

    menuItem.toggleAvailability();
    const updatedMenuItem = await this.menuItemRepository.update(menuItem);

    this.wsService.emit('menuItem:availabilityChanged', updatedMenuItem);
    return updatedMenuItem;
  }
}

export class DeleteMenuItemUseCase {
  constructor(
    private menuItemRepository: IMenuItemRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(id: string): Promise<void> {
    const menuItem = await this.menuItemRepository.findById(id);
    if (!menuItem) {
      throw new Error('Item de menú no encontrado');
    }

    await this.menuItemRepository.delete(id);
    this.wsService.emit('menuItem:deleted', { id });
  }
}
