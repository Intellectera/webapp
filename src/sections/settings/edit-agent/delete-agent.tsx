import Button from "@mui/material/Button";
import * as React from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import deleteAgent from "../../../utils/calls/agent/delete-agent.tsx";
import {CustomError} from "../../../utils/types.ts";
import {Agent} from "../../../utils/dto/Agent.ts";

type Props = {
    selectedAgent: Agent;
    setDeletedAgent: React.Dispatch<React.SetStateAction<Agent | undefined>>;
}

export default function DeleteAgentView({selectedAgent, setDeletedAgent}: Props) {
    const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const {t} = useTranslation();

    const handleDialogClose = () => {
        if (!isDeleteLoading) {
            setIsDialogOpen(false);
            setDeleteErrorMsg('');
            setDeletedAgent(undefined);
        }
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
        setDeleteErrorMsg('');
        setDeletedAgent(undefined);
    };

    const handleAgentDelete = () => {
        setIsDeleteLoading(true);
        setDeleteErrorMsg('');
        if (selectedAgent) {
            deleteAgent({id: selectedAgent.id!}).then(() => {
                setIsDialogOpen(false);
                setIsDeleteLoading(false);
                setDeletedAgent(selectedAgent);
            }).catch((error: any) => {
                let err = error as CustomError;
                if (err.error && err.error.message && err.error.message.length > 0) {
                    setDeleteErrorMsg(err.error.message)
                } else {
                    setDeleteErrorMsg(t('errors.something_went_wrong'))
                }
                setIsDeleteLoading(false);
            })
        }
    }


    return (
        <>
            <Button onClick={handleDialogOpen} variant={'outlined'}
                    color={'error'}
                    size={'small'}>{t('buttons.delete')}</Button>

            <Dialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('labels.delete_selected_agent')} : {selectedAgent && (`( ${selectedAgent.name} )`)}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('messages.agent_delete_confirmation')}
                    </DialogContentText>
                    {!!deleteErrorMsg && (<Alert sx={{marginY: '2rem'}} severity="error">{deleteErrorMsg}</Alert>)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>{t('buttons.cancel')}</Button>
                    <LoadingButton loading={isDeleteLoading} onClick={handleAgentDelete} autoFocus>
                        {t('buttons.delete_agent_confirm')}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
