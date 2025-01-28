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
    const [remaining, setRemaining] = useState(5);

    const [alertMessage, setAlertMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const approveWorkspaceInvitation = () => {
        approveInvitation({ invitationId: token! }).then(response => {
            setAlertMessage("");
            localStorageRemoveItem(WORKSPACE_STORAGE_KEY);
            localStorageRemoveItem(AGENT_STORAGE_KEY);

            setSuccess(true);
            const interval = setInterval(() => {
                setRemaining((prev) => prev - 1);
            }, 1000);
            setTimeout(() => {
                clearInterval(interval);
                setSuccess(false);
                if (response.accountExists) {
                    window.location.href = '/';
                } else {
                    const searchParams = new URLSearchParams({ email: response.email, invitationId: token! }).toString();
                    const href = `${paths.auth.jwt.register}?${searchParams}`
                    router.replace(href);
                }
            }, 5000);
        }).catch(error => {
            const customError: CustomError = error as CustomError;
            setAlertMessage(customError.error.message ? customError.error.message : 'Unknown error');
        });
    }

    useEffect(() => {
        if (!token || token === "") {
            setAlertMessage(t('errors.token_not_provided'));
        } else {
            approveWorkspaceInvitation();
        }
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-full">
            {success && <Alert severity="success">{t('messages.workspace_invitation_success') + ` ${remaining} ...`}</Alert>}

            <Typography variant="h4">{t('checking_workspace_invitation')}</Typography>

            {(alertMessage && alertMessage.length > 0) && (
                <Alert className="w-100" variant="filled" severity={"error"}>
                    {alertMessage}
                </Alert>
            )}

            <LoadingScreen />
        </div>
    );
}
