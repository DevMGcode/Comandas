import toast from 'react-hot-toast';
import { INotificationService } from '@domain/ports/repositories';

class NotificationService implements INotificationService {
  success(message: string): void {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '0.5rem',
        padding: '1rem',
      },
    });
  }

  error(message: string): void {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '0.5rem',
        padding: '1rem',
      },
    });
  }

  warning(message: string): void {
    toast(message, {
      duration: 3500,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
        borderRadius: '0.5rem',
        padding: '1rem',
      },
    });
  }

  info(message: string): void {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '0.5rem',
        padding: '1rem',
      },
    });
  }
}

export const notificationService = new NotificationService();
