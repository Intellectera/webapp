// utils
import axios from './../../../utils/axios';
import {TOKEN_STORAGE_KEY} from "./auth-provider.tsx";

// ----------------------------------------------------------------------

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = () => {
  const token: string | null = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    return false;
  }

  const decoded = jwtDecode(token);

  const currentTime: number = Math.floor(Date.now() / 1000);

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------


export const setSession = (token: string | null) => {
  if (token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    delete axios.defaults.headers.common.Authorization;
  }
};

// ----------------------------------------------------------------------