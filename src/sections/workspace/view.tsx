import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import loadWorkspaces from "../../utils/calls/workspace/load-workspaces.ts";
import {useContext, useEffect, useState} from "react";
import {Workspace} from "../../utils/dto/Workspace.ts";
import {
    SelectedWorkspaceContext,
    SelectedWorkspaceContextValue, WORKSPACE_STORAGE_KEY
} from "../../layouts/dashboard/context/workspace-provider.tsx";
import {localStorageRemoveItem, localStorageSetItem} from "../../utils/storage-available.ts";
import {useTranslation} from "react-i18next";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AGENT_STORAGE_KEY } from '../../layouts/dashboard/context/agent-provider.tsx';

// ----------------------------------------------------------------------

export const ChangeWorkspaceView = ({handleClose, open}: { handleClose: any, open: boolean }) => {
    const [workspaces, setWorkspaces] = useState<Array<Workspace>>([]);
    const workspaceContextValue: SelectedWorkspaceContextValue = useContext(SelectedWorkspaceContext);
    const {t } = useTranslation();

    useEffect(() => {
        let ignore = false;
        loadWorkspaces().then((result) => {
            if (!ignore) {
                setWorkspaces(result);
            }
        });
        return () => {
            ignore = true;
        };
    }, [workspaceContextValue.selectedWorkspace])

    const handleSelectWorkspace = (workspaceId: string) => {
        const workspace = workspaces.find(value => value.id === workspaceId)!;
        localStorageRemoveItem(AGENT_STORAGE_KEY);
        localStorageRemoveItem(WORKSPACE_STORAGE_KEY);
        localStorageSetItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
        workspaceContextValue.setSelectedWorkspace(workspace);
        window.location.reload();
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('titles.change_workspace')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{marginBottom: '2rem'}} id="alert-dialog-description">
                        {t('messages.change_workspace_desc')}
                    </DialogContentText>
                    <FormControl fullWidth={true} className={''}>
                        <InputLabel id="simple-select-label">{t('labels.selected_workspace')}</InputLabel>
                        <Select
                            labelId="simple-select-label"
                            id="simple-select"
                            value={(workspaceContextValue.selectedWorkspace === undefined || workspaces.length === 0) ? '' : workspaceContextValue.selectedWorkspace!.id!}
                            label={t('labels.selected_agent')}
                            onChange={(event: SelectChangeEvent) => handleSelectWorkspace(event.target.value)}
                        >
                            {workspaces.map(workspace => (
                                <MenuItem key={workspace.id} value={workspace.id}>{workspace.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('buttons.cancel')}</Button>
                    <Button onClick={handleClose} autoFocus>
                        {t('buttons.ok')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
