/**
 * Socket Service
 * Manages real-time communication via Socket.io
 */

import io, { Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';
import { getTokens } from './api.service';
import { Message, Notification } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Connect to socket server
   */
  async connect(): Promise<void> {
    const { accessToken } = await getTokens();

    if (!accessToken) {
      throw new Error('No access token available');
    }

    this.socket = io(API_CONFIG.SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Set up default listeners
    this.setupDefaultListeners();
  }

  /**
   * Set up default event listeners
   */
  private setupDefaultListeners(): void {
    if (!this.socket) return;

    // Message events (backend uses these exact event names)
    this.socket.on('message:received', (data: Message) => {
      this.emit('message:received', data);
    });

    this.socket.on('message:read', (data: any) => {
      this.emit('message:read', data);
    });

    // Notification events
    this.socket.on('notification:new', (data: Notification) => {
      this.emit('notification:new', data);
    });

    // User status events
    this.socket.on('user:online', (data: { userId: number }) => {
      this.emit('user:online', data);
    });

    this.socket.on('user:offline', (data: { userId: number }) => {
      this.emit('user:offline', data);
    });

    // Typing indicators (backend uses typing:started/stopped)
    this.socket.on('typing:started', (data: { userId: number }) => {
      this.emit('typing:started', data);
    });

    this.socket.on('typing:stopped', (data: { userId: number }) => {
      this.emit('typing:stopped', data);
    });
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  /**
   * Send message
   */
  sendMessage(receiverId: number, content: string, attachmentUrl?: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('message:send', {
      receiverId,
      content,
      attachmentUrl,
    });
  }

  /**
   * Send typing indicator
   */
  startTyping(receiverId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit('typing:started', { receiverId });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(receiverId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit('typing:stopped', { receiverId });
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: Function): void {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }

    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to local listeners
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
