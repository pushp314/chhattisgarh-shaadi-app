/**
 * Socket Service
 * Manages real-time communication via Socket.io
 */

import io, { Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';
import { getTokens } from './api.service';
import { Message, Notification } from '../types';
import { SOCKET_EVENTS } from '../constants/socket.constants';

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

    // Message events
    this.socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, (data: Message) => {
      console.log('Socket: Message received', data);
      this.emit(SOCKET_EVENTS.MESSAGE_RECEIVED, data);
    });

    this.socket.on(SOCKET_EVENTS.MESSAGE_READ, (data: any) => {
      console.log('Socket: Message read', data);
      this.emit(SOCKET_EVENTS.MESSAGE_READ, data);
    });

    // Notification events
    this.socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, (data: Notification) => {
      console.log('Socket: New notification', data);
      this.emit(SOCKET_EVENTS.NOTIFICATION_NEW, data);
    });

    // User status events
    this.socket.on(SOCKET_EVENTS.USER_ONLINE, (data: { userId: number }) => {
      console.log('Socket: User online', data.userId);
      this.emit(SOCKET_EVENTS.USER_ONLINE, data);
    });

    this.socket.on(SOCKET_EVENTS.USER_OFFLINE, (data: { userId: number }) => {
      console.log('Socket: User offline', data.userId);
      this.emit(SOCKET_EVENTS.USER_OFFLINE, data);
    });

    // Typing indicators
    this.socket.on(SOCKET_EVENTS.TYPING_START, (data: { userId: number }) => {
      this.emit(SOCKET_EVENTS.TYPING_START, data);
    });

    this.socket.on(SOCKET_EVENTS.TYPING_STOP, (data: { userId: number }) => {
      this.emit(SOCKET_EVENTS.TYPING_STOP, data);
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
   * Send message via socket (with callback for confirmation)
   */
  sendMessage(
    receiverId: number,
    content: string,
    callback?: (response: { success: boolean; message?: Message; error?: string }) => void
  ): void {
    if (!this.socket?.connected) {
      callback?.({ success: false, error: 'Socket not connected' });
      return;
    }

    this.socket.emit(SOCKET_EVENTS.MESSAGE_SEND, { receiverId, content }, callback);
  }

  /**
   * Mark messages as read
   */
  markMessagesAsRead(otherUserId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit(SOCKET_EVENTS.MESSAGE_READ, { userId: otherUserId });
  }

  /**
   * Send typing indicator
   */
  startTyping(receiverId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit(SOCKET_EVENTS.TYPING_START, { receiverId });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(receiverId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit(SOCKET_EVENTS.TYPING_STOP, { receiverId });
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
