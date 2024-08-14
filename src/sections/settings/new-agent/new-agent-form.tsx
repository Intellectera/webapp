import {useTranslation} from "react-i18next";
import {useCallback, useState} from "react";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {CustomError} from "../../../utils/types.ts";
import {IS_PRODUCTION} from "../../../config-global.ts";
import Typography from "@mui/material/Typography";
import FormProvider, {RHFTextField} from "../../../components/hook-form";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import * as React from "react";
import createAgent from "../../../utils/calls/agent/create-agent.tsx";
import {Agent} from "../../../utils/dto/Agent.ts";
import {useSelectedWorkspaceContext} from "../../../layouts/dashboard/context/workspace-context.tsx";
import {TableName} from "../../../utils/dto/TableName.ts";
import {DataSourceFormValuesProps} from "./new-agent-database-form.tsx";
import { dataSourceTypes } from "./new-agent-select-datasource.tsx";
import createExcelAgent from "../../../utils/calls/agent/create-agent-excel.tsx";

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


export default function NewAgentForm({submitRef, setActiveStep, setIsLoading,
    selectedDatasource, databaseTables, datasourceFormValues, setNewAgentCreated, selectedFiles}: Props) {

    const {t} = useTranslation();
    const [maxResponse, setMaxResponse] = useState<number>(200);
    const [textareaValue, setTextareaValue] = useState('');
    const workspace = useSelectedWorkspaceContext();

    const [errorMsg, setErrorMsg] = useState('');

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
        formState: {},
    } = methods;

    const getConnectionString = (values: DataSourceFormValuesProps): string => {
        // user:password@host/database
        return `${values.username}:${values.password}@${values.host}:${values.port}/${values.databaseName}`;
    }

    const isDatasourceExcel = () => {
        return selectedDatasource === dataSourceTypes.excel
    }

    const submitDatasource = (body: any) => {
        createAgent(body).then((data: Agent) => {
            setIsLoading(false);
            if (data.id){
                setActiveStep(prevState => prevState + 1);
                setNewAgentCreated(true);
            } else {
                setErrorMsg('Something went wrong.')
            }
        }).catch((error: any) => {
            let err = error as CustomError;
            if (!IS_PRODUCTION){
                console.log(err);
            }
            if (err.error && err.error.message && err.error.message.length > 0) {
                setErrorMsg(err.error.message)
            }
            setIsLoading(false);
        });
    }

    const submitExcelDatasource = (body: any) => {
        const formData: FormData = new FormData();
        // Append the JSON body with explicit Content-Type
        const jsonBlob = new Blob([JSON.stringify(body)], { type: 'application/json' });
        formData.append("body", jsonBlob);
        selectedFiles.forEach(file => formData.append("files", file));
        createExcelAgent(formData).then((data: Agent) => {
            setIsLoading(false);
            if (data.id){
                setActiveStep(prevState => prevState + 1);
                setNewAgentCreated(true);
            } else {
                setErrorMsg('Something went wrong.')
            }
        }).catch((error: any) => {
            let err = error as CustomError;
            if (!IS_PRODUCTION){
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
            if(isDatasourceExcel()){
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
                    <RHFTextField type={'text'} name="name"/>

                    <label className="block text-sm  mt-5 mb-2 ml-1 leading-6">
                        {t('labels.max_response')} ({maxResponse} {t('labels.words')})
                    </label>
                    <div style={{overflow: "visible"}} className="relative mb-6 overflow-visible-children">
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

                    <label className="block text-sm mt-5 mb-2 ml-1 leading-6">
                        {t('labels.agent_instructions')}
                    </label>
                    <RHFTextField value={textareaValue} onChange={(event) => setTextareaValue(event.target.value)} inputProps={{maxLength: 600}} multiline={true}
                                  minRows={5} maxRows={6} type={'text'} name="agentInstructions"/>
                    <label className="block text-[0.7rem] font-bold mt-1 mb-2 ml-1 leading-6">
                        {textareaValue.length + '/600'}
                    </label>

                    <label className="block text-sm  mt-5 mb-2 ml-1 leading-6">
                        {t('labels.pre_def_question1')}
                    </label>
                    <RHFTextField type={'text'} name="predefinedQuestion1"/>

                    <label className="block text-sm mt-5 mb-2 ml-1 leading-6">
                        {t('labels.pre_def_question2')}
                    </label>
                    <RHFTextField type={'text'} name="predefinedQuestion2"/>

                    {/*Hidden button for submitting*/}
                    <button ref={submitRef} className={'hidden'}/>
                </Stack>
            </FormProvider>

            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        </>
    );
}
