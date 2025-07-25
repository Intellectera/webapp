import {alpha, Theme} from '@mui/material/styles';
import {linearProgressClasses, LinearProgressProps} from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

// ----------------------------------------------------------------------

export default function Progress(theme: Theme) {
  const rootStyles = (ownerState: LinearProgressProps) => {
    const bufferVariant = ownerState.variant === 'buffer';

    const defaultStyle = {
      borderRadius: 4,
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 4,
      },
      ...(bufferVariant && {
        backgroundColor: 'transparent',
      }),
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
        backgroundColor: alpha(theme.palette[color].main, 0.24),
      }),
    }));

    return [defaultStyle, ...colorStyle];
  };

  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: LinearProgressProps }) => rootStyles(ownerState),
      },
    },
  };
}
