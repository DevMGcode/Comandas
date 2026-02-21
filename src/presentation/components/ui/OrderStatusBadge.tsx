import React from 'react';
import { OrderStatus } from '@domain/types';
import { Badge } from './Badge';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    [OrderStatus.PENDING]: { variant: 'warning' as const, text: 'Pendiente' },
    [OrderStatus.CONFIRMED]: { variant: 'info' as const, text: 'Confirmado' },
    [OrderStatus.PREPARING]: { variant: 'primary' as const, text: 'Preparando' },
    [OrderStatus.READY]: { variant: 'success' as const, text: 'Listo' },
    [OrderStatus.DELIVERED]: { variant: 'success' as const, text: 'Entregado' },
    [OrderStatus.CANCELLED]: { variant: 'error' as const, text: 'Cancelado' },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.text}</Badge>;
};
