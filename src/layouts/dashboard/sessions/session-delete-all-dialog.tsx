import {useSettingsContext} from "../../../components/settings";
import {useTranslation} from "react-i18next";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import * as React from "react";
import {useState} from "react";
import {CustomError} from "../../../utils/types.ts";
import deleteSession from "../../../utils/calls/session/delete-session.ts";
import {useSelectedAgentContext} from "../context/agent-context.tsx";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function SessionDeleteAllDialog() {
    const settings = useSettingsContext();
    const agentContext = useSelectedAgentContext();
    const {t } = useTranslation();
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = () => {
        if (!isDeleteLoading) {
            setIsDialogOpen(false);
            setDeleteErrorMsg('');
        }
    };

    const handleDeleteAllSessions = () => {
        setIsDeleteLoading(true);
        setDeleteErrorMsg('');

        if (agentContext.selectedAgent){
            deleteSession({agentId: agentContext.selectedAgent!.id!}).then(() => {
                setIsDialogOpen(false);
                setIsDeleteLoading(false);
                agentContext.setSelectedAgent(prevState => JSON.parse(JSON.stringify(prevState)));
            }).catch((error: any) => {
                let err = error as CustomError;
                if (err.error && err.error.message && err.error.message.length > 0) {
                    setDeleteErrorMsg(err.error.message)
                } else {
                    setDeleteErrorMsg(t('errors.something_went_wrong'))
                }
                setIsDeleteLoading(false);
            });
        }
    }

    return (
        <>
            <div className="mx-3 my-4">
                <button disabled={agentContext.selectedAgent === undefined} onClick={() => setIsDialogOpen(true)}
                        className={classNames('flex w-full gap-x-4 rounded-lg border border-slate-300 p-2 text-sm font-medium transition-colors duration-200 hover:bg-slate-200 focus:outline-none', settings.themeMode === 'dark' ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : '')}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                    </svg>
                    {t('labels.delete_all_sessions')}
                </button>
            </div>

            <Dialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('titles.delete_all_sessions')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('messages.delete_all_sessions_confirmation')}
                    </DialogContentText>
                    {!!deleteErrorMsg && (<Alert sx={{marginY: '2rem'}} severity="error">{deleteErrorMsg}</Alert>)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>{t('buttons.cancel')}</Button>
                    <LoadingButton loading={isDeleteLoading} onClick={handleDeleteAllSessions} autoFocus>
                        {t('buttons.remove_sessions')}
                    </LoadingButton>
                </DialogActions>
            </Dialog>

        </>
    );
}
