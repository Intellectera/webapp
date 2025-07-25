import { useCallback, useEffect, useMemo, useReducer } from 'react';
// utils
import axios, { API_ENDPOINTS } from './../../../utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType } from './../../types';
import { localStorageGetItem } from "../../../utils/storage-available.ts";
import { localStorageLngKey } from "../../../layouts/_common/language-popover.tsx";
import { useTranslation } from "react-i18next";

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const TOKEN_STORAGE_KEY = 'AAT';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { i18n: { changeLanguage } } = useTranslation();

  useEffect(() => {
    changeLanguage(localStorageGetItem(localStorageLngKey, 'en')).then();
  }, [])

  const [state, dispatch] = useReducer(reducer, initialState);

  // INITIAL
  const initialize = useCallback(async () => {
    try {
      if (isValidToken()) {
        const response = await axios.get(API_ENDPOINTS.v1.auth.me);

        const user = response.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const data = {
      email,
      password,
    };

    const response = await axios.post(API_ENDPOINTS.v1.auth.login, data);

    const { token, user } = response.data;

    setSession(token);

    dispatch({
      type: Types.LOGIN,
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string, invitationId: string | null) => {
      const data = {
        email,
        password,
        firstName,
        lastName,
        invitationId,
      };

      const response = await axios.post(API_ENDPOINTS.v1.auth.register, data);

      const { token, user } = response.data;

      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user,
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
