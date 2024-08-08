import Typography from "@mui/material/Typography";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {useCallback, useEffect, useState} from "react";
import {CustomerInvitation} from "../../../utils/dto/CustomerInvitation.ts";
import loadWorkspaceUsers from "../../../utils/calls/workspace/load-workspace-users.ts";
import {useSelectedWorkspaceContext} from "../../../layouts/dashboard/context/workspace-context.tsx";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    Backdrop,
    Grow,
    Modal
} from "@mui/material";
import {useSettingsContext} from "../../../components/settings";
import FormProvider, {RHFTextField} from "../../../components/hook-form";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import inviteNewUser from "../../../utils/calls/workspace/invite-new-user.ts";
import {CustomError} from "../../../utils/types.ts";
import Alert from "@mui/material/Alert";
import UsersTable from "./users-table.tsx";
import UsersDeleteDialog from "./users-delete-dialog.tsx";

type FormValuesProps = {
    name: string;
    email: string;
};



function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function UsersView() {
    const {t} = useTranslation();
    const [invitations, setInvitations] = useState<Array<CustomerInvitation>>([]);
    const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
    const [selectedRole, setSelectedRole] = useState(2);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [selectedInvitationForDelete, setSelectedInvitationForDelete] = useState<CustomerInvitation>();
    const workspaceContext = useSelectedWorkspaceContext();
    const settings = useSettingsContext();

    const FormSchema = Yup.object().shape(
        {
            name: Yup.string().required(t('errors.name_required')),
            email: Yup.string().required(t('errors.email_required')).email(t('errors.email_valid')),
        }
    );

    const defaultValues = {
        name: '',
        email: '',
    };

    const methods = useForm<FormValuesProps>({
        // @ts-ignore
        resolver: yupResolver(FormSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: {},
    } = methods;

    const onSubmit = useCallback(
        async (formValuesProps: FormValuesProps) => {
            setIsSubmitLoading(true);
            setErrorMsg('');
            let customerInvitation: CustomerInvitation = {
                name: formValuesProps.name,
                email: formValuesProps.email,
                workspace: workspaceContext.selectedWorkspace!,
                role: selectedRole,
                pending: true
            } as CustomerInvitation;
            inviteNewUser(customerInvitation).then(result => {
                handleInviteModalClose();
                setInvitations(prevState => {
                    prevState.push(result);
                    return prevState;
                });
                setSuccessMsg(t('messages.user_invited'));
                setTimeout(() => {
                    setSuccessMsg('');
                }, 3000)
                setIsSubmitLoading(false);
            }).catch((error: any) => {
                let err = error as CustomError;
                if (err.error && err.error.message && err.error.message.length > 0) {
                    setErrorMsg(err.error.message)
                } else {
                    setErrorMsg(t('errors.something_went_wrong'))
                }
                setIsSubmitLoading(false);
            })
        }, [reset]
    );



    const handleInviteModalClose = () => {
        setInviteModalOpen(false);
    };


    useEffect((): void => {
        loadWorkspaceUsers(workspaceContext.selectedWorkspace!.id!)
            .then((result) => setInvitations(result))
    }, [])



    return (
        <div className={'w-full h-full flex flex-col'}>
            <div className={'w-full flex flex-col items-center justify-center my-6'}>
                <Typography className={'text-center mb-3'} variant={'h5'}>
                    {t('titles.manage_users')}
                </Typography>
            </div>

            <div className={'px-10 sm:px-20'}>
                {!!successMsg && (
                    <Alert sx={{marginY: '2rem'}} severity="success">{successMsg}</Alert>
                )}
            </div>

            <div className={'w-full flex items-center justify-start px-10 sm:px-20 my-3'}>
                <Button onClick={() => setInviteModalOpen(true)} variant={'contained'} size={'small'} color={'inherit'}>
                    {t('buttons.invite_new_user')}
                </Button>
            </div>
            <div
                className={'h-[62vh] sm:mb-5 px-10 sm:px-20 overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent'}>
                <UsersTable invitations={invitations} setInvitations={setInvitations} setIsDialogOpen={setIsDialogOpen} setSelectedInvitationForDelete={setSelectedInvitationForDelete}></UsersTable>

                {/*New invitation modal*/}
                <Modal
                    open={inviteModalOpen}
                    onClose={handleInviteModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    closeAfterTransition
                    slots={{backdrop: Backdrop}}
                    slotProps={{
                        backdrop: {
                            timeout: 200,
                        },
                    }}
                >
                    <Grow
                        style={{transformOrigin: '0 0 0'}}
                        {...((inviteModalOpen) ? {timeout: 300} : {})}
                        in={inviteModalOpen}>
                        <div className={'h-screen w-screen transition-all ease-in '}>
                            <div className={classNames(settings.themeMode === 'light' ? 'bg-white' : 'bg-gray-800',
                                'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl md:w-3/6 w-4/6 h-3/6')}>
                                <div className={'w-full flex flex-col items-center justify-center my-6'}>
                                    <Typography className={'text-center mb-3'} variant={'h5'}>
                                        {t('titles.invite_user')}
                                    </Typography>
                                </div>
                                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                                    <Stack className={'px-10'}>
                                        {!!errorMsg && (
                                            <Alert sx={{marginY: '2rem'}} severity="error">{errorMsg}</Alert>)}

                                        <RHFTextField label={t('name')} type={'text'} name="name"/>
                                        <div className={'my-4'}/>
                                        <RHFTextField label={t('email')} type={'email'} name="email"/>
                                        <div className={'w-full flex my-8'}>
                                            <FormControl className={'flex-1'}>
                                                <InputLabel id="simple-select-label">{t('labels.role')}</InputLabel>
                                                <Select
                                                    labelId="simple-select-label"
                                                    id="simple-select"
                                                    value={selectedRole}
                                                    label={t('labels.role')}
                                                    onChange={(event) => setSelectedRole(Number(event.target.value))}
                                                >
                                                    <MenuItem value={2}>{t('labels.roles.admin')}</MenuItem>
                                                    <MenuItem value={3}>{t('labels.roles.user')}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>

                                        <LoadingButton loading={isSubmitLoading} type={"submit"}
                                                       color={'inherit'} size={'large'} variant={'contained'}
                                                       fullWidth={true}>
                                            {t('buttons.invite_user')}
                                        </LoadingButton>
                                    </Stack>
                                </FormProvider>

                            </div>
                        </div>
                    </Grow>
                </Modal>

                {/*Delete confirmation dialog*/}
                <UsersDeleteDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} setInvitations={setInvitations} setSuccessMsg={setSuccessMsg} selectedInvitationForDelete={selectedInvitationForDelete}></UsersDeleteDialog>
            </div>
        </div>
    );
}
