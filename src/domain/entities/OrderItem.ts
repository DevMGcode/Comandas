export class OrderItem {
  constructor(
    public readonly id: string,
    public menuItemId: string,
    public menuItemName: string,
    public quantity: number,
    public unitPrice: number,
    public notes: string = '',
    public readonly createdAt: Date = new Date()
  ) {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    if (unitPrice < 0) {
      throw new Error('El precio no puede ser negativo');
    }
  }

  get total(): number {
    return this.quantity * this.unitPrice;
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    this.quantity = newQuantity;
  }

  addQuantity(amount: number = 1): void {
    this.quantity += amount;
  }

  updateNotes(notes: string): void {
    this.notes = notes;
  }
}
