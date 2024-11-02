import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomError } from "../../../utils/types.ts";
import { IS_PRODUCTION } from "../../../config-global.ts";
import Typography from "@mui/material/Typography";
import FormProvider, { RHFTextField } from "../../../components/hook-form";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import * as React from "react";
import createAgent from "../../../utils/calls/agent/create-agent.tsx";
import { Agent } from "../../../utils/dto/Agent.ts";
import { useSelectedWorkspaceContext } from "../../../layouts/dashboard/context/workspace-context.tsx";
import { TableName } from "../../../utils/dto/TableName.ts";
import { DataSourceFormValuesProps } from "./new-agent-database-form.tsx";
import { dataSourceTypes } from "./new-agent-select-datasource.tsx";
import createExcelAgent from "../../../utils/calls/agent/create-agent-excel.tsx";
import { Box } from "@mui/material";
import PrettoSlider from "../../../components/_common/pretto-slider.tsx";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

type FormValuesProps = {
    name: string;
    maximumWords: number;
    agentInstructions: string;
    predefinedQuestion1: string;
    predefinedQuestion2: string;
};

type Props = {
    submitRef: React.RefObject<HTMLButtonElement>;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setNewAgentCreated: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDatasource: number;
    databaseTables: TableName[];
    datasourceFormValues: DataSourceFormValuesProps | undefined;
    selectedFiles: File[];
}


export default function NewAgentForm({ submitRef, setActiveStep, setIsLoading,
    selectedDatasource, databaseTables, datasourceFormValues, setNewAgentCreated, selectedFiles }: Props) {

    const { t } = useTranslation();
    const [maxResponse, setMaxResponse] = useState<number>(16000);
    const [textareaValue, setTextareaValue] = useState('');
    const [showProgress, setShowProgress] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [intervalValue, setIntervalValue] = useState<number | undefined>();
    const workspace = useSelectedWorkspaceContext();

    const formEndRef = React.useRef<null | HTMLDivElement>(null);

    const scrollToBottom = (timeout: number = 50) => {
        setTimeout(() => {
            formEndRef.current!.scrollIntoView({ behavior: "smooth" })
        }, timeout)
    }

    const FormSchema = Yup.object().shape(
        {
            name: Yup.string().required(t('errors.name_required')),
            maximumWords: Yup.number(),
            agentInstructions: Yup.string(),
            predefinedQuestion1: Yup.string(),
            predefinedQuestion2: Yup.string(),
        }
    );

    const defaultValues = {
        name: '',
        maximumWords: 0,
        agentInstructions: '',
        predefinedQuestion1: '',
        predefinedQuestion2: '',
    };

    const methods = useForm<FormValuesProps>({
        // @ts-ignore
        resolver: yupResolver(FormSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { },
    } = methods;

    const getConnectionString = (values: DataSourceFormValuesProps): string => {
        // user:password@host/database
        return `${values.username}:${values.password}@${values.host}:${values.port}/${values.databaseName}`;
    }

    const isDatasourceExcel = () => {
        return selectedDatasource === dataSourceTypes.excel
    }

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setMaxResponse(newValue);
        }
    };

    const submitDatasource = (body: any) => {
        createAgent(body).then((data: Agent) => {
            setIsLoading(false);
            if (data.id) {
                setActiveStep(prevState => prevState + 1);
                setNewAgentCreated(true);
            } else {
                setErrorMsg(t('errors.something_went_wrong'))
            }
        }).catch((error: any) => {
            let err = error as CustomError;
            if (!IS_PRODUCTION) {
                console.log(err);
            }
            if (err.error && err.error.message && err.error.message.length > 0) {
                setErrorMsg(err.error.message)
            }
            setIsLoading(false);
        });
    }

    React.useEffect(() => {
        if (progress === 91 && intervalValue) {
            window.clearInterval(intervalValue);
            setIntervalValue(undefined);
        }
    }, [progress]);

    React.useEffect(() => {
        if (!showProgress) {
            setIntervalValue(undefined);
        }
    }, [showProgress]);

    const handleProgress = () => {
        setShowProgress(true);
        setProgress(0);
        scrollToBottom();
        const interval = window.setInterval(() => {
            setProgress(prev => prev + 1);
        }, 500);
        setIntervalValue(interval);
    }


    const submitExcelDatasource = (body: any) => {
        const formData: FormData = new FormData();
        // Append the JSON body with explicit Content-Type
        const jsonBlob = new Blob([JSON.stringify(body)], { type: 'application/json' });
        formData.append("body", jsonBlob);
        selectedFiles.forEach(file => formData.append("files", file));
        handleProgress();
        createExcelAgent(formData).then((data: Agent) => {
            setIsLoading(false);
            setShowProgress(false);
            if (data.id) {
                setActiveStep(prevState => prevState + 1);
                setNewAgentCreated(true);
            } else {
                setErrorMsg(t('errors.something_went_wrong'))
            }
        }).catch((error: any) => {
            let err = error as CustomError;
            setShowProgress(false);
            scrollToBottom();
            if (!IS_PRODUCTION) {
                console.log(err);
            }
            if (err.error && err.error.message && err.error.message.length > 0) {
                setErrorMsg(err.error.message)
            }
            setIsLoading(false);
        });
    }

    const onSubmit = useCallback(
        async (formValue: FormValuesProps) => {
            setErrorMsg('');
            setIsLoading(true);
            const body = {
                name: formValue.name,
                workspace: workspace.selectedWorkspace!,
                configuration: {
                    maxTokens: maxResponse,
                    fallbackOn: false,
                    instructions: textareaValue,
                    databaseConfig: {
                        database: selectedDatasource,
                        /*1 -> Direct && 2 -> API (For future implementation)*/
                        connectionType: 1,
                        // user:password@host/database
                        connectionString: isDatasourceExcel() ? '' : getConnectionString(datasourceFormValues!),
                        /*1 -> Simple && 2 -> Bearer (For future implementation)*/
                        authorizationType: 1,
                        tables: isDatasourceExcel() ? [] : databaseTables.filter(table => table.selected).map(table => table.name.split('.')[1])
                    },
                    suggestions: [formValue.predefinedQuestion1, formValue.predefinedQuestion2]
                }
            };
            if (isDatasourceExcel()) {
                submitExcelDatasource(body)
            } else {
                submitDatasource(body)
            }
        },
        [reset]
    );

    return (
        <>
            <div className={'w-full flex flex-col items-center justify-center my-6'}>
                <Typography className={'text-center mb-3'} variant={'h5'}>
                    {selectedDatasource === dataSourceTypes.excel ? t('titles.new_agents_steps.step_4_excel') : t('titles.new_agents_steps.step_4')}
                </Typography>
            </div>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack className={'mb-8'}>
                    <label className="block text-sm  mb-2  ml-1 leading-6">
                        {t('name')}
                    </label>
                    <RHFTextField type={'text'} name="name" />

                    <label className="block text-sm  mt-5 mb-2 ml-1 leading-6">
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

                    <label className="block text-sm mt-5 mb-2 ml-1 leading-6">
                        {t('labels.agent_instructions')}
                    </label>
                    <RHFTextField value={textareaValue} onChange={(event) => setTextareaValue(event.target.value)} inputProps={{ maxLength: 5000 }} multiline={true}
                        minRows={5} maxRows={6} type={'text'} name="agentInstructions" />
                    <label className="block text-[0.7rem] font-bold mt-1 mb-2 ml-1 leading-6">
                        {textareaValue.length + '/5000'}
                    </label>

                    <label className="block text-sm  mt-5 mb-2 ml-1 leading-6">
                        {t('labels.pre_def_question1')}
                    </label>
                    <RHFTextField type={'text'} name="predefinedQuestion1" />

                    <label className="block text-sm mt-5 mb-2 ml-1 leading-6">
                        {t('labels.pre_def_question2')}
                    </label>
                    <RHFTextField type={'text'} name="predefinedQuestion2" />

                    {/*Hidden button for submitting*/}
                    <button ref={submitRef} className={'hidden'} />
                </Stack>
            </FormProvider>

            {(showProgress && selectedDatasource === dataSourceTypes.excel) && (
                <div className="w-full flex justify-center my-2">
                    <Gauge
                        {...{
                            width: 150,
                            height: 150,
                            value: progress,
                        }}
                        cornerRadius="50%"
                        text={({value}) => `${value}%`}
                        sx={(theme) => ({
                            [`& .${gaugeClasses.valueText}`]: {
                                fontSize: 25,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                                fill: theme.palette.primary.main,
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                                fill: theme.palette.text.disabled,
                            },
                        })}
                    />
                </div>
            )}

            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}


            {/*Dummy div for scrolling*/}
            <div ref={formEndRef}></div>

        </>
    );
}
