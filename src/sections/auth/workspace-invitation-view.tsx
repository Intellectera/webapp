import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Alert, Typography } from "@mui/material";
import { LoadingScreen } from "../../components/loading-screen";
import { useEffect, useState } from "react";
import approveInvitation from "../../utils/calls/workspace/approve-invitation";
import { CustomError } from "../../utils/types";
import { localStorageRemoveItem } from "../../utils/storage-available";
import { WORKSPACE_STORAGE_KEY } from "../../layouts/dashboard/context/workspace-provider";
import { AGENT_STORAGE_KEY } from "../../layouts/dashboard/context/agent-provider";
import { useRouter } from "../../routes/hook";
import { paths } from "../../routes/paths";

export default function WorkspaceInvitationView() {
    const { t } = useTranslation();
    const { token } = useParams();
    const router = useRouter();

    const [hasError, setHasError] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const approveWorkspaceInvitation = () => {
        approveInvitation({ invitationId: token! }).then(response => {
            localStorageRemoveItem(WORKSPACE_STORAGE_KEY);
            localStorageRemoveItem(AGENT_STORAGE_KEY);
            
            if (response.accountExists) {
                window.location.href = '/';
            } else {
                const searchParams = new URLSearchParams({ email: response.email, invitationId: token! }).toString();
                const href = `${paths.auth.jwt.register}?${searchParams}`
                router.replace(href);
            }
        }).catch(error => {
            const customError: CustomError = error as CustomError;
            setAlertMessage(customError.error.message ? customError.error.message : 'Unknown error');
        });
    }

    useEffect(() => {
        if (!token || token === "") {
            setHasError(true);
            setAlertMessage(t('errors.token_not_provided'));
        } else {
            approveWorkspaceInvitation();
        }
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Typography variant="h4">{t('checking_workspace_invitation')}</Typography>

            {(alertMessage && alertMessage.length > 0) && (
                <Alert className="w-100" variant="filled" severity={hasError ? "error" : "success"}>
                    {hasError ? t('errors.forget_password') : t('messages.forget_password_sent')}
                </Alert>
            )}

            <LoadingScreen />
        </div>
    );
}
