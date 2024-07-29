import {useEffect} from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// hooks
import {useResponsive} from './../../hooks/use-responsive';
// components
import Logo from './../../components/logo';
import Scrollbar from './../../components/scrollbar';
import {usePathname} from '../../routes/hook';
//
import {NAV} from './../config-layout';
import SessionsList from "./sessions-list.tsx";

// ----------------------------------------------------------------------

type Props = {
    openNav: boolean;
    onCloseNav: VoidFunction;
};

export default function NavVertical({openNav, onCloseNav}: Props) {
    const pathname = usePathname();

    const lgUp = useResponsive('up', 'lg');

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <div className={'w-[100%] flex justify-center items-center'}>
                <Logo sx={{mt: 2, ml: 0, mb: 3, mr: 0}}/>
            </div>

            <SessionsList/>

            <Box sx={{flexGrow: 1}}/>

        </Scrollbar>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: {lg: 0},
                width: {lg: NAV.W_VERTICAL},
            }}
        >

            {lgUp ? (
                <Stack
                    sx={{
                        height: 1,
                        position: 'fixed',
                        width: NAV.W_VERTICAL,
                        borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                >
                    {renderContent}
                </Stack>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    PaperProps={{
                        sx: {
                            width: NAV.W_VERTICAL,
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}
