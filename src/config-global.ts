// routes
import { paths } from './routes/paths';

// API
// ----------------------------------------------------------------------

export const IS_PRODUCTION: boolean = import.meta.env.VITE_PRODUCTION === 'true';
export const ASSETS_API = import.meta.env.VITE_ASSETS_API;
export const CAPTCHA_SITE_KEY = '6LdtbsgpAAAAAK3V5mkINMH5Gwdd6wkwSdojJBiX';

export const AUTH0_API = {
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL,
};

export const MAPBOX_API = import.meta.env.VITE_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'

export const getBackendUrl = async (): Promise<string> => {
  try {
    const response = await fetch('/assets/env.txt'); // Path to your env file
    const result = await response.text();
    const json = JSON.parse(result);
    return json['BACKEND_URL'];
  } catch (error) {
    console.error('Failed to load environment variables:', error);
    throw error;
  }
};