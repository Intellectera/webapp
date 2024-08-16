import axios from 'axios';
// config
import {BACKEND_URL} from './../config-global';
import {TOKEN_STORAGE_KEY} from "../auth/context/jwt/auth-provider.tsx";
import { CustomError } from './types.ts';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BACKEND_URL , withCredentials: true, timeout: 1000 * 60 * 5});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response && error.response.status === 401){
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      delete axios.defaults.headers.common.Authorization;
      window.location.href = '/';
    }
    const customError : CustomError = error.response.data as CustomError;
    return Promise.reject(customError);
  }
);

export default axiosInstance;

export const API_ENDPOINTS = {
  v1: {
    auth: {
      me: '/api/v1/auth/me',
      login: '/api/v1/auth/authenticate',
      register: '/api/v1/auth/register',
    },
    agent: {
      create: '/api/v1/agent/create',
      createExcel: '/api/v1/agent/create-excel',
      update: '/api/v1/agent/update',
      delete: '/api/v1/agent/remove',
      load: '/api/v1/agent/load'
    },
    workspace: {
      create: '/api/v1/workspace/create',
      loadAvailable: '/api/v1/workspace/list-available',
      loadWorkspaceUsers: '/api/v1/workspace/load-workspace-users',
      inviteUser: '/api/v1/workspace/invite',
      deleteUser: '/api/v1/workspace/remove-user'
    },
    session: {
      load: '/api/v1/session/load',
      delete: '/api/v1/session/remove',
      update: '/api/v1/session/update'
    },
    chat: {
      send: '/api/v1/conversation/send',
      load: '/api/v1/conversation/load',
      stt: '/api/v1/conversation/stt',
      tts: '/api/v1/conversation/tts',
    },
    db: {
      loadTablesList: '/api/v1/conversation/list-tables'
    },
    license: {
      loadUsage: '/api/v1/license/load-usage'
    }
  },
};
