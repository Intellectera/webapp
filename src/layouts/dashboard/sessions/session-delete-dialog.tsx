import MenuItem from "@mui/material/MenuItem";
import {useTranslation} from "react-i18next";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import * as React from "react";
import {useState} from "react";
import deleteSession from "../../../utils/calls/session/delete-session.ts";
import {CustomError} from "../../../utils/types.ts";
import {Session} from "../../../utils/dto/Session.ts";

type Props = {
    sessions: Session[];
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
    editSessionIndex: number;
    popover : any;
}

export default function SessionDeleteDialog({sessions, editSessionIndex, setSessions, popover}: Props) {
    const {t} = useTranslation();
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = () => {
        if (!isDeleteLoading) {
            setIsDialogOpen(false);
            setDeleteErrorMsg('');
        }
    };

    const handleDeleteSession = () => {
        setIsDeleteLoading(true);
        setDeleteErrorMsg('');
        const sessionId = sessions[editSessionIndex]!.id!;

        deleteSession({sessionId: sessionId}).then(() => {
            setSessions(prevState => {
                prevState = prevState.filter(session => session.id !== sessionId);
                return prevState;
            })
            setIsDialogOpen(false);
            setIsDeleteLoading(false);
            popover.onClose();
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

    const handleDeleteClick = () => {
        setIsDialogOpen(true);
    }

    return (
        <>
            <MenuItem
                selected={true}
                onClick={handleDeleteClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                </svg>

                {t('buttons.delete')}
            </MenuItem>

            <Dialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('labels.delete_session')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('messages.delete_session_confirmation')}
                    </DialogContentText>
                    {!!deleteErrorMsg && (<Alert sx={{marginY: '2rem'}} severity="error">{deleteErrorMsg}</Alert>)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>{t('buttons.cancel')}</Button>
                    <LoadingButton loading={isDeleteLoading} onClick={handleDeleteSession} autoFocus>
                        {t('buttons.delete_session')}
                    </LoadingButton>
                </DialogActions>
            </Dialog>

        </>
    );
}
