import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { OrderStatusBadge } from '../components/ui/OrderStatusBadge';
import { useOrderStore } from '../stores/order.store';
import { useTableStore } from '../stores/table.store';
import { useAuthStore } from '../stores/auth.store';
import { OrderStatus } from '@domain/types';
import { notificationService } from '@infrastructure/services/notification.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const KitchenPage: React.FC = () => {
  const { orders, loadActiveOrders, startPreparing, markAsReady } = useOrderStore();
  const { tables } = useTableStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    loadActiveOrders();
    // Simulación de actualización en tiempo real
    const interval = setInterval(() => {
      loadActiveOrders();
    }, 3000);
    return () => clearInterval(interval);
  }, [loadActiveOrders]);

  const confirmedOrders = orders.filter(o => o.status === OrderStatus.CONFIRMED);
  const preparingOrders = orders.filter(o => o.status === OrderStatus.PREPARING);
  const readyOrders = orders.filter(o => o.status === OrderStatus.READY);

  const handleStartPreparing = async (orderId: string) => {
    if (!user?.canPrepareOrders()) {
      notificationService.error('No tienes permisos para esta acción');
      return;
    }
    
    try {
      await startPreparing(orderId);
      notificationService.success('Pedido en preparación');
    } catch (error) {
      notificationService.error('Error al iniciar preparación');
    }
  };

  const handleMarkAsReady = async (orderId: string) => {
    if (!user?.canPrepareOrders()) {
      notificationService.error('No tienes permisos para esta acción');
      return;
    }
    
    try {
      await markAsReady(orderId);
      notificationService.success('Pedido listo para servir');
    } catch (error) {
      notificationService.error('Error al marcar como listo');
    }
  };

  const OrderCard = ({ order }: { order: any }) => {
    const table = tables.find(t => t.id === order.tableId);
    const timeAgo = format(new Date(order.createdAt), 'HH:mm', { locale: es });

    return (
      <Card className="hover:border-primary-500/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-dark-50">Mesa {table?.number}</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-2 text-dark-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-400">{order.itemCount}</p>
            <p className="text-dark-400 text-sm">items</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex items-start justify-between p-3 glass rounded-lg">
              <div className="flex-1">
                <p className="text-dark-100 font-medium">{item.menuItemName}</p>
                {item.notes && (
                  <p className="text-dark-400 text-sm mt-1">📝 {item.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary-400">x{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm">💬 {order.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {order.status === OrderStatus.CONFIRMED && (
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={() => handleStartPreparing(order.id)}
            >
              <ChefHat className="w-5 h-5" />
              Iniciar Preparación
            </Button>
          )}
          {order.status === OrderStatus.PREPARING && (
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={() => handleMarkAsReady(order.id)}
            >
              ✓ Marcar como Listo
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-dark-50 mb-2">Vista de Cocina</h1>
        <p className="text-dark-400">
          {confirmedOrders.length + preparingOrders.length} pedidos en proceso
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Confirmed Orders */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <h2 className="text-xl font-bold text-dark-100">
              Nuevos ({confirmedOrders.length})
            </h2>
          </div>
          <div className="space-y-4">
            {confirmedOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
            {confirmedOrders.length === 0 && (
              <Card>
                <p className="text-dark-400 text-center py-8">
                  No hay pedidos nuevos
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Preparing Orders */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
            <h2 className="text-xl font-bold text-dark-100">
              En Preparación ({preparingOrders.length})
            </h2>
          </div>
          <div className="space-y-4">
            {preparingOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
            {preparingOrders.length === 0 && (
              <Card>
                <p className="text-dark-400 text-center py-8">
                  No hay pedidos en preparación
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Ready Orders */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <h2 className="text-xl font-bold text-dark-100">
              Listos ({readyOrders.length})
            </h2>
          </div>
          <div className="space-y-4">
            {readyOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
            {readyOrders.length === 0 && (
              <Card>
                <p className="text-dark-400 text-center py-8">
                  No hay pedidos listos
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
