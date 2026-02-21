import { Table } from '@domain/entities/Table';
import { ITableRepository } from '@domain/ports/repositories';
import { TableStatus } from '@domain/types';

class MockTableRepository implements ITableRepository {
  private tables: Map<string, Table> = new Map();

  constructor() {
    // Inicializar con algunas mesas de ejemplo
    this.seedInitialTables();
  }

  private seedInitialTables(): void {
    for (let i = 1; i <= 12; i++) {
      const capacity = i <= 4 ? 2 : i <= 8 ? 4 : 6;
      const location = i <= 6 ? 'main' : i <= 10 ? 'terrace' : 'vip';
      const id = `table-${i}`;
      
      // Todas las mesas comienzan disponibles
      const status = TableStatus.AVAILABLE;
      const currentOrderId = null;
      
      const table = new Table(id, i, capacity, status, currentOrderId, location);
      this.tables.set(table.id, table);
    }
  }

  async findById(id: string): Promise<Table | null> {
    return this.tables.get(id) || null;
  }

  async findAll(): Promise<Table[]> {
    return Array.from(this.tables.values());
  }

  async findByStatus(status: TableStatus): Promise<Table[]> {
    return Array.from(this.tables.values()).filter(table => table.status === status);
  }

  async findByNumber(number: number): Promise<Table | null> {
    return Array.from(this.tables.values()).find(table => table.number === number) || null;
  }

  async save(table: Table): Promise<Table> {
    this.tables.set(table.id, table);
    return table;
  }

  async update(table: Table): Promise<Table> {
    this.tables.set(table.id, table);
    return table;
  }

  async delete(id: string): Promise<void> {
    this.tables.delete(id);
  }
}

export const mockTableRepository = new MockTableRepository();
