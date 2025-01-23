// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/chat',
};

// ----------------------------------------------------------------------

export const paths = {
  intellectera: 'https://intellectera.ai',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/login`,
      register: `${ROOTS.AUTH}/register`,
      forgetPassword: `${ROOTS.AUTH}/forget-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
};
