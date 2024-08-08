import {useTranslation} from "react-i18next";
import FormProvider, {RHFTextField} from "../../components/hook-form";
import Stack from "@mui/material/Stack";
import * as React from "react";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useCallback, useEffect, useRef, useState} from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import loadAgents from "../../utils/calls/agent/load-agents.ts";
import {Agent} from "../../utils/dto/Agent.ts";
import {useSelectedWorkspaceContext} from "../../layouts/dashboard/context/workspace-context.tsx";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import updateAgent from "../../utils/calls/agent/update-agent.tsx";
import {CustomError} from "../../utils/types.ts";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import deleteAgent from "../../utils/calls/agent/delete-agent.tsx";


type FormValuesProps = {
    name: string;
    predefinedQuestion1: string;
    predefinedQuestion2: string;
};

export default function EditAgentSettings() {
    const {t} = useTranslation();
    const workspaceContext = useSelectedWorkspaceContext();
    const [agents, setAgents] = React.useState<Array<Agent>>([]);
    const [selectedAgent, setSelectedAgent] = React.useState<Agent>();
    const [maxResponse, setMaxResponse] = useState<number>(200);
    const [textareaValue, setTextareaValue] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const formStartRef = useRef<null | HTMLDivElement>(null);


    const defaultValues = {
        name: '',
        predefinedQuestion1: '',
        predefinedQuestion2: '',
    };

    const FormSchema = Yup.object().shape(
        {
            name: Yup.string().required(t('errors.name_required')),
            predefinedQuestion1: Yup.string(),
            predefinedQuestion2: Yup.string(),
        }
    );

    const methods = useForm<FormValuesProps>({
        // @ts-ignore
        resolver: yupResolver(FormSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        setValue,
        formState: {},
    } = methods;

    const scrollToTop = (timeout: number = 50) => {
        setTimeout(() => {
            formStartRef.current!.scrollIntoView({behavior: "smooth"})
        }, timeout)
    }

    useEffect((): void => {
        loadAgents(workspaceContext.selectedWorkspace!.id!).then((result: Array<Agent>) => {
            setAgents(result);
            if (result.length > 0) {
                setSelectedAgent(result[0])
            }
        });
    }, []);

    useEffect((): void => {
        if (agents && agents.length > 0){
            setSelectedAgent(agents[0]);
        } else {
            setSelectedAgent(undefined);
        }
    }, [agents]);

    useEffect(() => {
        if (selectedAgent) {
            setMaxResponse(selectedAgent.configuration.maxTokens);
            setTextareaValue(selectedAgent.configuration.instructions ?? '');
            setValue('name', selectedAgent.name);
            setValue('predefinedQuestion1', selectedAgent.configuration.suggestions![0] ?? '');
            setValue('predefinedQuestion2', selectedAgent.configuration.suggestions![1] ?? '');
        } else {
            setMaxResponse(200);
            setTextareaValue('');
            reset();
        }
    }, [selectedAgent])

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedAgent(agents.find(agent => agent.id === event.target.value as string)!);
    };

    const handleDialogClose = () => {
        if (!isDeleteLoading) {
            setIsDialogOpen(false);
            setDeleteErrorMsg('');
        }
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
        setDeleteErrorMsg('');
    };



    const onSubmit = useCallback(
        async (formValuesProps: FormValuesProps) => {
            if (selectedAgent !== undefined) {
                setErrorMsg('');
                setIsSubmitLoading(true);
                const agent: Agent = {...selectedAgent};
                agent.name = formValuesProps.name;
                agent.configuration.instructions = textareaValue;
                agent.configuration.maxTokens = maxResponse;
                agent.configuration.suggestions = [formValuesProps.predefinedQuestion1, formValuesProps.predefinedQuestion2]

                updateAgent(agent).then(() => {
                    setSuccessMsg(t('messages.agent_update'));
                    scrollToTop();
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
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
                    scrollToTop();
                })
            }
        }, [reset, selectedAgent]
    );

    const handleAgentDelete = () => {
        setIsDeleteLoading(true);
        setDeleteErrorMsg('');
        if (selectedAgent) {
            deleteAgent({id: selectedAgent.id!}).then(() => {
                setAgents(prevState => {
                    prevState = prevState.filter(agent => agent.id !== selectedAgent.id);
                    return prevState;
                });
                scrollToTop();
                setIsDialogOpen(false);
                setSuccessMsg(t('messages.agent_deleted'));
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000)
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
    }

    return (
        <div className={'w-full h-full flex flex-col'}>
            <div className={'w-full flex flex-col items-center justify-center my-6'}>
                <Typography className={'text-center mb-3'} variant={'h5'}>
                    {t('titles.manage_available_agents')}
                </Typography>
            </div>
            <div
                className={'h-[67vh] sm:h-[63vh] sm:mb-5 px-10 overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent'}>
                <div ref={formStartRef}></div>

                {showSuccess && (<Alert sx={{marginY: '2rem'}} severity="success">{successMsg}</Alert>)}
                {!!errorMsg && (<Alert sx={{marginY: '2rem'}} severity="error">{errorMsg}</Alert>)}

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Stack className={'px-8'}>
                        <div className={'w-full flex my-8'}>
                            <FormControl className={'flex-1'}>
                                <InputLabel id="simple-select-label">Selected Agent</InputLabel>
                                <Select
                                    labelId="simple-select-label"
                                    id="simple-select"
                                    value={(selectedAgent === undefined || agents.length === 0) ? '' : selectedAgent!.id!}
                                    label="Selected Agent"
                                    onChange={handleChange}
                                >
                                    {agents.map(agent => (
                                        <MenuItem key={agent.id} value={agent.id}>{agent.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <RHFTextField label={t('name')} type={'text'} name="name"/>

                        <label className="block text-sm mt-5 mb-2 ml-1 leading-6">
                            {t('labels.max_response')} ({maxResponse} {t('labels.words')})
                        </label>
                        <div style={{overflow: "visible"}} className="relative mb-10 overflow-visible-children">
                            <label htmlFor="labels-range-input" className="sr-only">Labels range</label>
                            <input onChange={(event) => {
                                setMaxResponse(Number(event.target.value))
                            }} value={maxResponse} id="labels-range-input" type="range" min="200" max="16000" step={100}
                                   className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                            <span
                                className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">200</span>
                            <span
                                className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">5000</span>
                            <span
                                className="text-sm text-gray-500 dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">10000</span>
                            <span
                                className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">16000</span>
                        </div>

                        <RHFTextField label={t('labels.agent_instructions')} value={textareaValue}
                                      onChange={(event) => setTextareaValue(event.target.value)}
                                      inputProps={{maxLength: 600}} multiline={true}
                                      minRows={5} maxRows={6} type={'text'} name="agentInstructions"/>
                        <label className="block text-[0.7rem] font-bold mt-1 ml-1 leading-6">
                            {textareaValue.length + '/600'}
                        </label>

                        <div className={'mb-4'}></div>

                        <RHFTextField label={t('labels.pre_def_question1')} type={'text'} name="predefinedQuestion1"/>

                        <div className={'my-4'}></div>

                        <RHFTextField label={t('labels.pre_def_question2')} type={'text'} name="predefinedQuestion2"/>

                        <div className={'my-4'}></div>


                        <LoadingButton loading={isSubmitLoading} type={"submit"} disabled={selectedAgent === undefined}
                                       color={'inherit'} size={'large'} variant={'contained'} fullWidth={true}>
                            {t('buttons.update_agent')}
                        </LoadingButton>

                        <div className={'my-6 w-full border-[1px] border-dashed border-gray-500'}/>

                    </Stack>
                </FormProvider>

                <div className={'px-8'}>
                    <div className={'w-full flex flex-col items-center justify-center mb-3'}>
                        <Typography className={'text-center'} variant={'h5'}>
                            {t('labels.delete_selected_agent')}: {selectedAgent && (`( ${selectedAgent.name} )`)}
                        </Typography>
                    </div>

                    <LoadingButton onClick={handleDialogOpen}
                                   type={'button'} disabled={selectedAgent === undefined}
                                   sx={{backgroundColor: (theme) => theme.palette.error.dark, color: '#fff',
                                   marginTop: '1rem'}}
                                   fullWidth={true} size={'large'} variant={'contained'}>
                        {t('buttons.delete_agent')}
                    </LoadingButton>
                </div>

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
            </div>
        </div>
    );
}
