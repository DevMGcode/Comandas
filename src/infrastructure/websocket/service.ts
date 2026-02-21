import { io, Socket } from 'socket.io-client';
import { IWebSocketService } from '@domain/ports/repositories';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080';

class WebSocketService implements IWebSocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor(url: string = WS_URL) {
    this.url = url;
  }

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    const token = localStorage.getItem('auth_token');

    this.socket = io(this.url, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket conectado');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket desconectado');
    });

    this.socket.on('connect_error', error => {
      console.error('Error de conexión WebSocket:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: unknown): void {
    if (!this.socket) {
      console.warn('WebSocket no está conectado');
      return;
    }
    this.socket.emit(event, data);
  }

  on(event: string, callback: (data: unknown) => void): void {
    if (!this.socket) {
      console.warn('WebSocket no está conectado');
      return;
    }
    this.socket.on(event, callback);
  }

  off(event: string, callback?: (data: unknown) => void): void {
    if (!this.socket) {
      return;
    }
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();
