import {Theme} from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function AppBar(_: Theme) {
  return {
    MuiAppBar: {
      defaultProps: {
        color: 'transparent',
      },

      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  };
}
