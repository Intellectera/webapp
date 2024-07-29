// @mui
import Box, {BoxProps} from '@mui/material/Box';
// hooks
import {useResponsive} from './../../hooks/use-responsive';
//
import {HEADER, NAV} from './../config-layout';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({children, sx, ...other}: BoxProps) {

    const lgUp = useResponsive('up', 'lg');

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: `${HEADER.H_MOBILE + SPACING}px`,
                ...(lgUp && {
                    px: 2,
                    py: `${HEADER.H_DESKTOP + SPACING}px`,
                    width: `calc(100% - ${NAV.W_VERTICAL}px)`,
                }),
                ...sx,
            }}
            {...other}
        >
            {children}
        </Box>
    );
}
