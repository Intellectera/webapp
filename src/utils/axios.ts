import axios from 'axios';
// config
import {BACKEND_URL} from './../config-global';
import {TOKEN_STORAGE_KEY} from "../auth/context/jwt/auth-provider.tsx";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BACKEND_URL , withCredentials: true});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response && error.response.status === 401){
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      delete axios.defaults.headers.common.Authorization;
      window.location.href = '/';
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
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
      delete: '/api/v1/session/remove'
    },
    chat: {
      send: '/api/v1/conversation/send',
      load: '/api/v1/conversation/load',
    },
    db: {
      loadTablesList: '/api/v1/conversation/list-tables'
    }
  },
};
