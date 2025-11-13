/**
 * Message Service
 * Handles all messaging-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Message, Conversation, ApiResponse, PaginationParams, PaginationResponse } from '../types';

class MessageService {
  /**
   * Send message
   */
  async sendMessage(
    receiverId: number,
    content: string,
    attachmentUrl?: string,
    attachmentType?: string
  ): Promise<Message> {
    const response = await api.post<ApiResponse<Message>>(
      API_ENDPOINTS.MESSAGES.SEND,
      {
        receiverId,
        content,
        attachmentUrl,
        attachmentType,
      }
    );
    return response.data.data;
  }

  /**
   * Get all conversations
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get<ApiResponse<{ conversations: Conversation[] }>>(
      API_ENDPOINTS.MESSAGES.CONVERSATIONS
    );
    return response.data.data.conversations;
  }

  /**
   * Get conversation with user
   */
  async getConversation(
    userId: number,
    params?: PaginationParams
  ): Promise<{
    messages: Message[];
    pagination: PaginationResponse;
  }> {
    const response = await api.get<ApiResponse<{
      messages: Message[];
      pagination: PaginationResponse;
    }>>(API_ENDPOINTS.MESSAGES.CONVERSATION(userId), { params });
    return response.data.data;
  }

  /**
   * Mark messages as read
   */
  async markAsRead(userId: number): Promise<void> {
    await api.put(API_ENDPOINTS.MESSAGES.MARK_READ(userId));
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get<ApiResponse<{ unreadCount: number }>>(
      API_ENDPOINTS.MESSAGES.UNREAD_COUNT
    );
    return response.data.data.unreadCount;
  }

  /**
   * Delete message
   */
  async deleteMessage(messageId: number): Promise<void> {
    await api.delete(API_ENDPOINTS.MESSAGES.DELETE(messageId));
  }
}

export default new MessageService();
