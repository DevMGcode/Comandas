import React from 'react';
import { TableStatus } from '@domain/types';
import { Badge } from './Badge';

interface TableStatusBadgeProps {
  status: TableStatus;
}

export const TableStatusBadge: React.FC<TableStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    [TableStatus.AVAILABLE]: { variant: 'success' as const, text: 'Disponible' },
    [TableStatus.OCCUPIED]: { variant: 'error' as const, text: 'Ocupada' },
    [TableStatus.RESERVED]: { variant: 'warning' as const, text: 'Reservada' },
    [TableStatus.CLEANING]: { variant: 'info' as const, text: 'Limpiando' },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.text}</Badge>;
};
