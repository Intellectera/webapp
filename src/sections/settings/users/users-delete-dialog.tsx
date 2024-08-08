import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import * as React from "react";
import deleteUser from "../../../utils/calls/workspace/delete-user.ts";
import {CustomError} from "../../../utils/types.ts";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {CustomerInvitation} from "../../../utils/dto/CustomerInvitation.ts";

type Props = {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setInvitations: React.Dispatch<React.SetStateAction<CustomerInvitation[]>>;
    setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
    selectedInvitationForDelete: CustomerInvitation | undefined;
}

export default function UsersDeleteDialog({isDialogOpen, setIsDialogOpen, setInvitations, selectedInvitationForDelete, setSuccessMsg}: Props) {
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
    const {t} = useTranslation();

    const handleDialogClose = () => {
        if (!isDeleteLoading) {
            setIsDialogOpen(false);
            setDeleteErrorMsg('');
        }
    };

    const handleUserDelete = () => {
        setIsDeleteLoading(true);
        setDeleteErrorMsg('');

        deleteUser(selectedInvitationForDelete!).then(() => {
            setInvitations(prevState => {
                prevState = prevState.filter(invitation => invitation.id !== selectedInvitationForDelete!.id!)
                return prevState;
            })
            setSuccessMsg(t('messages.user_deleted'));
            setTimeout(() => {
                setSuccessMsg('');
            }, 3000)
            setIsDialogOpen(false);
            setIsDeleteLoading(false);
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

    return (
        <Dialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {t('titles.delete_user')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {t('messages.user_delete_confirmation')}
                </DialogContentText>
                {!!deleteErrorMsg && (<Alert sx={{marginY: '2rem'}} severity="error">{deleteErrorMsg}</Alert>)}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>{t('buttons.cancel')}</Button>
                <LoadingButton loading={isDeleteLoading} onClick={handleUserDelete} autoFocus>
                    {t('buttons.delete_user')}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
