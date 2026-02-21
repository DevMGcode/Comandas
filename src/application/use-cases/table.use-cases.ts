import { Table } from '@domain/entities/Table';
import { ITableRepository, IWebSocketService } from '@domain/ports/repositories';
import { TableStatus } from '@domain/types';

export class GetAllTablesUseCase {
  constructor(private tableRepository: ITableRepository) {}

  async execute(): Promise<Table[]> {
    return this.tableRepository.findAll();
  }
}

export class GetAvailableTablesUseCase {
  constructor(private tableRepository: ITableRepository) {}

  async execute(): Promise<Table[]> {
    return this.tableRepository.findByStatus(TableStatus.AVAILABLE);
  }
}

export class CreateTableUseCase {
  constructor(
    private tableRepository: ITableRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(number: number, capacity: number, location: string = 'main'): Promise<Table> {
    // Verificar que no exista una mesa con el mismo número
    const existingTable = await this.tableRepository.findByNumber(number);
    if (existingTable) {
      throw new Error('Ya existe una mesa con ese número');
    }

    const table = new Table(crypto.randomUUID(), number, capacity, TableStatus.AVAILABLE, null, location);

    const savedTable = await this.tableRepository.save(table);
    this.wsService.emit('table:created', savedTable);

    return savedTable;
  }
}

export class UpdateTableUseCase {
  constructor(
    private tableRepository: ITableRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(tableId: string, updates: { capacity?: number; location?: string }): Promise<Table> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Mesa no encontrada');
    }

    if (updates.capacity !== undefined) {
      table.updateCapacity(updates.capacity);
    }

    if (updates.location !== undefined) {
      table.location = updates.location;
    }

    const updatedTable = await this.tableRepository.update(table);
    this.wsService.emit('table:updated', updatedTable);

    return updatedTable;
  }
}

export class FreeTableUseCase {
  constructor(
    private tableRepository: ITableRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(tableId: string): Promise<Table> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Mesa no encontrada');
    }

    table.free();
    const freedTable = await this.tableRepository.update(table);

    this.wsService.emit('table:freed', freedTable);
    return freedTable;
  }
}

export class MarkTableAsAvailableUseCase {
  constructor(
    private tableRepository: ITableRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(tableId: string): Promise<Table> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Mesa no encontrada');
    }

    table.markAsAvailable();
    const availableTable = await this.tableRepository.update(table);

    this.wsService.emit('table:available', availableTable);
    return availableTable;
  }
}

export class ReserveTableUseCase {
  constructor(
    private tableRepository: ITableRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(tableId: string): Promise<Table> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Mesa no encontrada');
    }

    table.reserve();
    const reservedTable = await this.tableRepository.update(table);

    this.wsService.emit('table:reserved', reservedTable);
    return reservedTable;
  }
}

export class DeleteTableUseCase {
  constructor(
    private tableRepository: ITableRepository,
    private wsService: IWebSocketService
  ) {}

  async execute(tableId: string): Promise<void> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Mesa no encontrada');
    }

    // No permitir eliminar mesas ocupadas o con pedidos activos
    if (table.isOccupied()) {
      throw new Error('No se puede eliminar una mesa ocupada. Libera la mesa primero.');
    }

    await this.tableRepository.delete(tableId);
    this.wsService.emit('table:deleted', { id: tableId });
  }
}
