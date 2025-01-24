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
      recoverPassword: `${ROOTS.AUTH}/recover-password`,
    },
    workspace: {
      approveInvitation: `${ROOTS.AUTH}/workspace-invitation`
    }
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
};
