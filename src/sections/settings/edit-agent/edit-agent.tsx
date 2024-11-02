import { useTranslation } from "react-i18next";
import FormProvider, { RHFTextField } from "../../../components/hook-form";
import Stack from "@mui/material/Stack";
import * as React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useRef, useState } from "react";
import { Agent } from "../../../utils/dto/Agent.ts";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import updateAgent from "../../../utils/calls/agent/update-agent.tsx";
import { CustomError } from "../../../utils/types.ts";
import Button from "@mui/material/Button";
import Iconify from "../../../components/iconify";
import { useSettingsContext } from "../../../components/settings";
import { Box } from "@mui/material";
import PrettoSlider from "../../../components/_common/pretto-slider.tsx";


type FormValuesProps = {
    name: string;
    predefinedQuestion1: string;
    predefinedQuestion2: string;
};

type Props = {
    selectedAgent: Agent;
    setSelectedAgent: React.Dispatch<React.SetStateAction<Agent | undefined>>;
    setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function EditAgentView({ selectedAgent, setSelectedAgent, setShowEdit }: Props) {
    const { t } = useTranslation();
    const settings = useSettingsContext();
    const formStartRef = useRef<null | HTMLDivElement>(null);
    const [maxResponse, setMaxResponse] = useState<number>(200);
    const [textareaValue, setTextareaValue] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);


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
        formState: { },
    } = methods;

    const scrollToTop = (timeout: number = 50) => {
        setTimeout(() => {
            formStartRef.current!.scrollIntoView({ behavior: "smooth" })
        }, timeout)
    }

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
    }, [selectedAgent]);

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setMaxResponse(newValue);
        }
    };

    const onSubmit = useCallback(
        async (formValuesProps: FormValuesProps) => {
            if (selectedAgent !== undefined) {
                setErrorMsg('');
                setIsSubmitLoading(true);
                const agent: Agent = { ...selectedAgent };
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
                    setSelectedAgent(agent);
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
        }, [reset, selectedAgent, maxResponse, textareaValue]
    );


    return (
        <>
            <div ref={formStartRef}></div>

            {showSuccess && (<Alert sx={{ marginY: '2rem' }} severity="success">{successMsg}</Alert>)}
            {!!errorMsg && (<Alert sx={{ marginY: '2rem' }} severity="error">{errorMsg}</Alert>)}

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack className={'sm:px-10 mt-6'}>
                    <div className={'flex items-center justify-start my-2'}>
                        <Button onClick={() => setShowEdit(false)} variant={'outlined'} color={'warning'} size={'medium'}>
                            <Iconify icon={`gravity-ui:arrow-${settings.themeDirection === 'ltr' ? 'left' : 'right'}`} width={18} />
                            <span className={'mx-1'}>{t('buttons.back')}</span>
                        </Button>
                    </div>
                    <div className={'mb-4'}></div>

                    <RHFTextField label={t('name')} type={'text'} name="name" />

                    <label className="block text-sm mt-5 mb-2 ml-1 leading-6">
                        {t('labels.max_response')} ({maxResponse} {t('labels.words')})
                    </label>
                    <Box sx={{ width: '100%', marginBottom: '1rem' }}>
                        <PrettoSlider
                            aria-label={'pretto slider'}
                            min={500}
                            max={16000}
                            step={200}
                            value={maxResponse}
                            onChange={handleSliderChange}
                            getAriaValueText={(value: any) => `${value}`}
                            valueLabelDisplay="auto"
                        ></PrettoSlider>
                    </Box>

                    <RHFTextField label={t('labels.agent_instructions')} value={textareaValue}
                        onChange={(event) => setTextareaValue(event.target.value)}
                        inputProps={{ maxLength: 5000 }} multiline={true}
                        minRows={5} maxRows={6} type={'text'} name="agentInstructions" />
                    <label className="block text-[0.7rem] font-bold mt-1 ml-1 leading-6">
                        {textareaValue.length + '/5000'}
                    </label>

                    <div className={'mb-4'}></div>

                    <RHFTextField label={t('labels.pre_def_question1')} type={'text'} name="predefinedQuestion1" />

                    <div className={'my-4'}></div>

                    <RHFTextField label={t('labels.pre_def_question2')} type={'text'} name="predefinedQuestion2" />

                    <div className={'my-4'}></div>


                    <LoadingButton loading={isSubmitLoading} type={"submit"} disabled={selectedAgent === undefined}
                        color={'inherit'} size={'large'} variant={'contained'} fullWidth={true}>
                        {t('buttons.update_agent')}
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </>
    );
}
