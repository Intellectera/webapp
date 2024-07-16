// routes
import {paths} from './routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = "http://localhost:3000";
export const ASSETS_API = import.meta.env.REACT_APP_ASSETS_API;

export const AUTH0_API = {
  clientId: import.meta.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: import.meta.env.REACT_APP_AUTH0_DOMAIN,
  callbackUrl: import.meta.env.REACT_APP_AUTH0_CALLBACK_URL,
};

export const MAPBOX_API = import.meta.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
