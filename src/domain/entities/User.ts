import { UserRole } from '../types';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public role: UserRole,
    public isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isWaiter(): boolean {
    return this.role === UserRole.WAITER;
  }

  isChef(): boolean {
    return this.role === UserRole.CHEF;
  }

  canManageOrders(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.WAITER;
  }

  canPrepareOrders(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.CHEF;
  }

  update(data: Partial<Pick<User, 'name' | 'email' | 'isActive'>>): void {
    if (data.name) this.name = data.name;
    if (data.email) this.email = data.email;
    if (data.isActive !== undefined) this.isActive = data.isActive;
    this.updatedAt = new Date();
  }
}
