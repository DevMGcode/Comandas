import { MenuItem } from '@domain/entities/MenuItem';
import { IMenuItemRepository } from '@domain/ports/repositories';
import { MenuItemCategory } from '@domain/types';

class MockMenuItemRepository implements IMenuItemRepository {
  private items: Map<string, MenuItem> = new Map();

  constructor() {
    this.seedInitialItems();
  }

  private seedInitialItems(): void {
    const menuItems = [
      // Entradas
      { name: 'Ensalada César', desc: 'Lechuga romana, crutones, parmesano', price: 89, cat: MenuItemCategory.APPETIZER, time: 10 },
      { name: 'Bruschetta', desc: 'Pan tostado, tomate fresco, albahaca', price: 75, cat: MenuItemCategory.APPETIZER, time: 8 },
      { name: 'Tabla de Quesos', desc: 'Selección de quesos artesanales', price: 150, cat: MenuItemCategory.APPETIZER, time: 5 },
      
      // Platos principales
      { name: 'Filete Mignon', desc: 'Filete de res premium 250g', price: 380, cat: MenuItemCategory.MAIN_COURSE, time: 25 },
      { name: 'Salmón a la Plancha', desc: 'Salmón fresco con vegetales', price: 320, cat: MenuItemCategory.MAIN_COURSE, time: 20 },
      { name: 'Pasta Carbonara', desc: 'Pasta con panceta y salsa cremosa', price: 180, cat: MenuItemCategory.MAIN_COURSE, time: 18 },
      { name: 'Risotto de Hongos', desc: 'Risotto cremoso con hongos mixtos', price: 195, cat: MenuItemCategory.MAIN_COURSE, time: 22 },
      { name: 'Pollo a la Parmesana', desc: 'Pechuga empanizada con queso', price: 220, cat: MenuItemCategory.MAIN_COURSE, time: 20 },
      
      // Postres
      { name: 'Tiramisú', desc: 'Postre italiano clásico', price: 95, cat: MenuItemCategory.DESSERT, time: 5 },
      { name: 'Cheesecake', desc: 'Pastel de queso con frutos rojos', price: 85, cat: MenuItemCategory.DESSERT, time: 5 },
      { name: 'Volcán de Chocolate', desc: 'Chocolate fundido caliente', price: 110, cat: MenuItemCategory.DESSERT, time: 12 },
      
      // Bebidas
      { name: 'Agua Mineral', desc: 'Natural o con gas 500ml', price: 35, cat: MenuItemCategory.BEVERAGE, time: 2 },
      { name: 'Refresco', desc: 'Variedad de sabores', price: 40, cat: MenuItemCategory.BEVERAGE, time: 2 },
      { name: 'Jugo Natural', desc: 'Naranja, fresa o mango', price: 55, cat: MenuItemCategory.BEVERAGE, time: 5 },
      { name: 'Café Espresso', desc: 'Café italiano', price: 45, cat: MenuItemCategory.BEVERAGE, time: 3 },
      { name: 'Vino de la Casa', desc: 'Copa de vino tinto o blanco', price: 85, cat: MenuItemCategory.BEVERAGE, time: 2 },
    ];

    menuItems.forEach(item => {
      const menuItem = new MenuItem(
        crypto.randomUUID(),
        item.name,
        item.desc,
        item.price,
        item.cat,
        null,
        true,
        item.time
      );
      this.items.set(menuItem.id, menuItem);
    });
  }

  async findById(id: string): Promise<MenuItem | null> {
    return this.items.get(id) || null;
  }

  async findAll(): Promise<MenuItem[]> {
    return Array.from(this.items.values());
  }

  async findAvailable(): Promise<MenuItem[]> {
    return Array.from(this.items.values()).filter(item => item.isAvailable);
  }

  async findByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.items.values()).filter(item => item.category === category);
  }

  async save(item: MenuItem): Promise<MenuItem> {
    this.items.set(item.id, item);
    return item;
  }

  async update(item: MenuItem): Promise<MenuItem> {
    this.items.set(item.id, item);
    return item;
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}

export const mockMenuItemRepository = new MockMenuItemRepository();
