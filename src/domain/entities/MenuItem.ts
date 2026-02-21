import { MenuItemCategory } from '../types';

export class MenuItem {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public category: MenuItemCategory,
    public imageUrl: string | null = null,
    public isAvailable: boolean = true,
    public preparationTime: number = 15, // en minutos
    public ingredients: string[] = [],
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    if (price < 0) {
      throw new Error('El precio no puede ser negativo');
    }
  }

  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    this.price = newPrice;
    this.updatedAt = new Date();
  }

  toggleAvailability(): void {
    this.isAvailable = !this.isAvailable;
    this.updatedAt = new Date();
  }

  update(data: Partial<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>>): void {
    if (data.name) this.name = data.name;
    if (data.description) this.description = data.description;
    if (data.price !== undefined) this.updatePrice(data.price);
    if (data.category) this.category = data.category;
    if (data.imageUrl !== undefined) this.imageUrl = data.imageUrl;
    if (data.isAvailable !== undefined) this.isAvailable = data.isAvailable;
    if (data.preparationTime) this.preparationTime = data.preparationTime;
    if (data.ingredients) this.ingredients = data.ingredients;
    this.updatedAt = new Date();
  }
}
