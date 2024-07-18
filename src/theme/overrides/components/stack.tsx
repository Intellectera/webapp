import {Theme} from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Stack(_: Theme) {
  return {
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  };
}
