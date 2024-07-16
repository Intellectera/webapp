import {Props} from 'simplebar-react';
// @mui
import {SxProps, Theme} from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ScrollbarProps extends Props {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}
