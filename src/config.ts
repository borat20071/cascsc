// API configuration
// Use the runtime config if available, otherwise fall back to the default
declare global {
  interface Window {
    APP_CONFIG?: {
      API_BASE_URL: string;
    };
  }
}

export const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || '/api';

// Application settings
export const APP_NAME = 'Science Club Community';
export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=random';

// Feature flags
export const ENABLE_MOCKS = import.meta.env?.MODE === 'development' || false; 