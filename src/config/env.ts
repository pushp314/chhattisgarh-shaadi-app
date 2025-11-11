// CREATE: src/config/env.ts
/**
 * Environment configuration
 *
 * IMPORTANT: DO NOT add sensitive keys here.
 * For staging/production, use environment variables.
 * For local dev, you can create a `src/config/env.local.ts`
 * and export values from there, but DO NOT commit it.
 *
 * This file just provides a central place for API URLs.
 */

// TODO: Replace with your actual backend URL
const API_BASE_URL = 'http://10.0.2.2:8000/api'; // 10.0.2.2 is Android emulator's "localhost"
const SOCKET_URL = 'http://10.0.2.2:8000'; // Socket.IO server URL

export const env = {
  API_BASE_URL,
  SOCKET_URL,
};