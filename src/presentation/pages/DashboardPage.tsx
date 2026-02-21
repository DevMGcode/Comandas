import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Utensils, ShoppingBag, DollarSign, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTableStore } from '../stores/table.store';
import { useOrderStore } from '../stores/order.store';
import { useAuthStore } from '../stores/auth.store';
import { TableStatus, OrderStatus } from '@domain/types';
import { notificationService } from '@infrastructure/services/notification.service';

export const DashboardPage: React.FC = () => {
  const { tables, loadTables } = useTableStore();
  const { orders, loadActiveOrders, deliverOrder } = useOrderStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    loadTables();
    loadActiveOrders();
    // Auto-refrescar cada 5 segundos
    const interval = setInterval(() => {
      loadActiveOrders();
      loadTables();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadTables, loadActiveOrders]);

  const handleDeliverOrder = async (orderId: string) => {
    if (!user?.isWaiter() && !user?.isAdmin()) {
      notificationService.error('No tienes permisos para esta acción');
      return;
    }
    
    try {
      await deliverOrder(orderId);
      notificationService.success('Pedido entregado. Mesa liberada para limpieza.');
    } catch (error) {
      notificationService.error('Error al entregar el pedido');
    }
  };

  const readyOrders = orders.filter(o => o.status === OrderStatus.READY);

  const stats = [
    {
      title: 'Mesas Disponibles',
      value: tables.filter(t => t.status === TableStatus.AVAILABLE).length,
      total: tables.length,
      icon: Users,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Pedidos Activos',
      value: orders.filter(o => !o.isDelivered() && !o.isCancelled()).length,
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'En Cocina',
      value: orders.filter(o => o.status === OrderStatus.PREPARING || o.status === OrderStatus.CONFIRMED).length,
      icon: Utensils,
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Listos para Servir',
      value: orders.filter(o => o.status === OrderStatus.READY).length,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-dark-50 mb-2">
          ¡Bienvenido de vuelta, {user?.name}!
        </h1>
        <p className="text-dark-400">Panel de control del restaurante</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-400 text-sm font-medium mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-dark-50">
                      {stat.value}
                      {stat.total && (
                        <span className="text-lg text-dark-400">/{stat.total}</span>
                      )}
                    </p>
                  </div>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Glow effect */}
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-20 rounded-full blur-3xl`}></div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Ready Orders - Listos para Servir */}
        {(user?.isWaiter() || user?.isAdmin()) && readyOrders.length > 0 && (
          <Card className="lg:col-span-2 border-green-500/30">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-green-400">Listos para Servir ({readyOrders.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readyOrders.map((order) => {
                const table = tables.find(t => t.id === order.tableId);
                return (
                  <div key={order.id} className="p-4 glass rounded-lg border border-green-500/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-dark-50">Mesa #{table?.number}</h3>
                        <p className="text-dark-400 text-sm">{order.itemCount} items · ${order.total.toFixed(2)}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                        Listo
                      </div>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-dark-300 text-sm">
                          • {item.quantity}x {item.menuItemName}
                        </p>
                      ))}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleDeliverOrder(order.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Servir y Liberar Mesa
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Active Orders */}
        <Card>
          <h2 className="text-xl font-bold text-dark-50 mb-4">Pedidos en Proceso</h2>
          <div className="space-y-3">
            {orders.filter(o => o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.PREPARING).slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 glass rounded-lg">
                <div>
                  <p className="text-dark-100 font-medium">Mesa #{tables.find(t => t.id === order.tableId)?.number}</p>
                  <p className="text-dark-400 text-sm">{order.itemCount} items · ${order.total.toFixed(2)}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === OrderStatus.PREPARING ? 'bg-orange-500/20 text-orange-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {order.status === OrderStatus.PREPARING ? 'Preparando' : 'Confirmado'}
                </div>
              </div>
            ))}
            {orders.filter(o => o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.PREPARING).length === 0 && (
              <p className="text-dark-400 text-center py-8">No hay pedidos en proceso</p>
            )}
          </div>
        </Card>

        {/* Tables Overview */}
        <Card>
          <h2 className="text-xl font-bold text-dark-50 mb-4">Estado de Mesas</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <span className="text-dark-300">Disponibles</span>
              <span className="text-green-400 font-bold">
                {tables.filter(t => t.status === TableStatus.AVAILABLE).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <span className="text-dark-300">Ocupadas</span>
              <span className="text-red-400 font-bold">
                {tables.filter(t => t.status === TableStatus.OCCUPIED).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <span className="text-dark-300">Reservadas</span>
              <span className="text-yellow-400 font-bold">
                {tables.filter(t => t.status === TableStatus.RESERVED).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <span className="text-dark-300">En Limpieza</span>
              <span className="text-blue-400 font-bold">
                {tables.filter(t => t.status === TableStatus.CLEANING).length}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
