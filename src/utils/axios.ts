import axios from 'axios';
// config
import {BACKEND_URL} from './../config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BACKEND_URL , withCredentials: true});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
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
      load: '/api/v1/agent/load'
    },
    workspace: {
      create: '/api/v1/workspace/create',
      loadAvailable: '/api/v1/workspace/list-available',
    }
  },
};
