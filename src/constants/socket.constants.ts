/**
 * Socket Event Constants
 * Must match backend SOCKET_EVENTS in utils/constants.js
 */

export const SOCKET_EVENTS = {
    // Connection events
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',

    // Message events
    MESSAGE_SEND: 'message:send',
    MESSAGE_RECEIVED: 'message:received',
    MESSAGE_READ: 'message:read',

    // Typing events
    TYPING_START: 'typing:start',
    TYPING_STOP: 'typing:stop',

    // User presence events
    USER_ONLINE: 'user:online',
    USER_OFFLINE: 'user:offline',

    // Notification events
    NOTIFICATION_NEW: 'notification:new',
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
