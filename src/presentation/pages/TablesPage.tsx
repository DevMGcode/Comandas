import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TableStatusBadge } from '../components/ui/TableStatusBadge';
import { useTableStore } from '../stores/table.store';
import { useAuthStore } from '../stores/auth.store';
import { Table } from '@domain/entities/Table';
import { TableStatus } from '@domain/types';
import { notificationService } from '@infrastructure/services/notification.service';
import { CreateOrderModal } from '../components/modals/CreateOrderModal';
import { CreateTableModal } from '../components/modals/CreateTableModal';

export const TablesPage: React.FC = () => {
  const { tables, loadTables, createTable, deleteTable, markAsAvailable, freeTable } = useTableStore();
  const user = useAuthStore(state => state.user);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showCreateTable, setShowCreateTable] = useState(false);

  useEffect(() => {
    loadTables();
    // Simulación de actualización en tiempo real
    const interval = setInterval(() => {
      loadTables();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadTables]);

  const handleTableAction = async (table: Table) => {
    if (user?.isAdmin() || user?.isWaiter()) {
      if (table.isAvailable()) {
        setSelectedTable(table);
        setShowCreateOrder(true);
      } else if (table.status === TableStatus.CLEANING) {
        try {
          await markAsAvailable(table.id);
          notificationService.success('Mesa marcada como disponible');
        } catch (error) {
          notificationService.error('Error al actualizar la mesa');
        }
      }
    }
  };

  const handleFreeTable = async (table: Table) => {
    if (user?.isAdmin() || user?.isWaiter()) {
      try {
        await freeTable(table.id);
        notificationService.success('Mesa liberada');
      } catch (error) {
        notificationService.error('Error al liberar la mesa');
      }
    }
  };

  const handleCreateTable = async (number: number, capacity: number, location: string) => {
    if (!user?.isAdmin()) {
      notificationService.error('No tienes permisos para esta acción');
      return;
    }

    await createTable(number, capacity, location);
  };

  const handleDeleteTable = async (table: Table, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.isAdmin()) {
      notificationService.error('No tienes permisos para esta acción');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la Mesa ${table.number}?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteTable(table.id);
      notificationService.success(`Mesa ${table.number} eliminada correctamente`);
    } catch (error) {
      notificationService.error((error as Error).message);
    }
  };

  const getTableColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'from-green-500/20 to-green-600/20 border-green-500/30 hover:from-green-500/30 hover:to-green-600/30';
      case TableStatus.OCCUPIED:
        return 'from-red-500/20 to-red-600/20 border-red-500/30 hover:from-red-500/30 hover:to-red-600/30';
      case TableStatus.RESERVED:
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 hover:from-yellow-500/30 hover:to-yellow-600/30';
      case TableStatus.CLEANING:
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const groupedTables = {
    main: tables.filter(t => t.location === 'main'),
    terrace: tables.filter(t => t.location === 'terrace'),
    vip: tables.filter(t => t.location === 'vip'),
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-dark-50 mb-2">Gestión de Mesas</h1>
          <p className="text-dark-400">
            {tables.filter(t => t.isAvailable()).length} de {tables.length} mesas disponibles
          </p>
        </div>
        {user?.isAdmin() && (
          <Button variant="primary" size="md" onClick={() => setShowCreateTable(true)}>
            <Plus className="w-5 h-5" />
            Nueva Mesa
          </Button>
        )}
      </div>

      {/* Tables by location */}
      {Object.entries(groupedTables).map(([location, locationTables]) => (
        <div key={location} className="mb-8">
          <h2 className="text-2xl font-bold text-dark-100 mb-4 capitalize">
            {location === 'main' ? 'Área Principal' : location === 'terrace' ? 'Terraza' : 'VIP'}
          </h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          >
            {locationTables.map((table, index) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`relative bg-gradient-to-br ${getTableColor(table.status)} border-2 transition-all duration-300 cursor-pointer`}
                  hover={table.isAvailable()}
                  onClick={() => handleTableAction(table)}
                >
                  {/* Botón eliminar (solo admin y mesa disponible) */}
                  {user?.isAdmin() && table.isAvailable() && (
                    <button
                      onClick={(e) => handleDeleteTable(table, e)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all z-10"
                      title="Eliminar mesa"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                  
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                      <Users className="w-8 h-8 text-dark-100" />
                    </div>
                    <h3 className="text-2xl font-bold text-dark-50 mb-1">
                      {table.number}
                    </h3>
                    <p className="text-dark-400 text-sm mb-2">
                      {table.capacity} personas
                    </p>
                    <TableStatusBadge status={table.status} />
                  </div>

                  {/* Actions */}
                  {table.status === TableStatus.CLEANING && (user?.isAdmin() || user?.isWaiter()) && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTableAction(table);
                        }}
                      >
                        Marcar Disponible
                      </Button>
                    </div>
                  )}
                  
                  {table.isOccupied() && (user?.isAdmin() || user?.isWaiter()) && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFreeTable(table);
                        }}
                      >
                        Liberar Mesa
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}

      {/* Create Order Modal */}
      {showCreateOrder && selectedTable && (
        <CreateOrderModal
          table={selectedTable}
          onClose={() => {
            setShowCreateOrder(false);
            setSelectedTable(null);
          }}
        />
      )}

      {/* Create Table Modal */}
      {showCreateTable && (
        <CreateTableModal
          onClose={() => setShowCreateTable(false)}
          onSubmit={handleCreateTable}
        />
      )}
    </div>
  );
};
