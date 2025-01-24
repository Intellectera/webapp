import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// routes
import { useRouter } from '../../routes/hook';
// auth
import { useAuthContext } from '../../auth/hooks';
// components
import { varHover } from '../../components/animate';
import CustomPopover, { usePopover } from './../../components/custom-popover';
import { localStorageGetItem, localStorageRemoveItem, localStorageSetItem } from '../../utils/storage-available';
import { localStorageLngKey } from './language-popover';
import { useSettingsContext } from '../../components/settings';
import { SettingsView } from "../../sections/settings/view.tsx";
import { useEffect, useState } from "react";
import { SelectedWorkspaceContextValue, WORKSPACE_STORAGE_KEY } from "../dashboard/context/workspace-provider.tsx";
import { ChangeWorkspaceView } from "../../sections/workspace/view.tsx";
import { useTranslation } from "react-i18next";
import { AGENT_STORAGE_KEY } from "../dashboard/context/agent-provider.tsx";
import UsageView from '../../sections/usage/view.tsx';
import { useSelectedWorkspaceContext } from '../dashboard/context/workspace-context.tsx';

// ----------------------------------------------------------------------

const OPTIONS: Array<{ label: string, linkTo: string }> = [];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const settings = useSettingsContext();
    const authContext = useAuthContext();
    const selectedWorkspaceContextValue: SelectedWorkspaceContextValue = useSelectedWorkspaceContext();

    const handleClose = () => {
        settings.onClose();
    }

    const { t } = useTranslation();

    const [openChangeWorkspace, setOpenChangeWorkspace] = useState(false);
    const [openUsage, setOpenUsage] = useState(false);

    const handleChangeWorkspaceClose = () => {
        setOpenChangeWorkspace(false)
    }

    const router = useRouter();

    const { logout } = useAuthContext();

    const popover = usePopover();


    const handleLogout = async () => {
        try {
            await logout();
            localStorageSetItem(localStorageLngKey, 'en')
            settings.onChangeDirectionByLang('en')
            popover.onClose();
            localStorageRemoveItem(WORKSPACE_STORAGE_KEY)
            localStorageRemoveItem(AGENT_STORAGE_KEY)
            router.replace('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenSettings = () => {
        settings.onOpen();
        popover.onClose();
    }

    const handleOpenChangeWorkspace = () => {
        setOpenChangeWorkspace(true);
        popover.onClose();
    }

    const handleOpenUsage = () => {
        setOpenUsage(true);
        popover.onClose();
    }

    const handleClickItem = (path: string) => {
        popover.onClose();
        router.push(path);
    };


    useEffect((): void => {
        let loadedWorkspace = localStorageGetItem(WORKSPACE_STORAGE_KEY, '');
        if (loadedWorkspace && loadedWorkspace.length > 0) {
            let workspace = JSON.parse(loadedWorkspace);
            selectedWorkspaceContextValue.setSelectedWorkspace(workspace);
        } else {
            selectedWorkspaceContextValue.setSelectedWorkspace(undefined);
            localStorageRemoveItem(AGENT_STORAGE_KEY);
            handleOpenChangeWorkspace();
        }
    }, []);

    return (
        <>
            <SettingsView handleClose={handleClose}></SettingsView>
            <ChangeWorkspaceView handleClose={handleChangeWorkspaceClose} open={openChangeWorkspace}></ChangeWorkspaceView>
            <UsageView openUsage={openUsage} setOpenUsage={setOpenUsage}></UsageView>
            <IconButton
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover(1.05)}
                onClick={popover.onOpen}
                sx={{
                    width: 40,
                    height: 40,
                    background: (theme) => alpha(theme.palette.grey[500], 0.08),
                    ...(popover.open && {
                        background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    }),
                }}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        border: (theme) => `solid 2px ${theme.palette.background.default}`,
                    }}
                />
            </IconButton>

            <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
                <Box sx={{ p: 2, pb: 1.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        {authContext.user?.firstName + ' ' + authContext.user?.lastName}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {authContext.user?.email}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    {OPTIONS.map((option) => (
                        <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Stack>

                {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

                {(selectedWorkspaceContextValue.selectedWorkspace?.role == 1 || 
                selectedWorkspaceContextValue.selectedWorkspace?.role == 2
                ) && (
                    <>
                        <MenuItem
                            onClick={handleOpenSettings}
                            sx={{ m: 1, fontWeight: 'fontWeightBold' }}
                        >
                            {t('settings')}
                        </MenuItem>

                        <MenuItem
                            onClick={handleOpenUsage}
                            sx={{ m: 1, fontWeight: 'fontWeightBold' }}
                        >
                            {t('labels.usage')}
                        </MenuItem>
                    </>
                )}

                <MenuItem
                    onClick={handleOpenChangeWorkspace}
                    sx={{ m: 1, fontWeight: 'fontWeightBold' }}
                >
                    {t('titles.change_workspace')}
                </MenuItem>

                <MenuItem
                    onClick={handleLogout}
                    sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
                >
                    {t('logout')}
                </MenuItem>
            </CustomPopover>
        </>
    );
}
