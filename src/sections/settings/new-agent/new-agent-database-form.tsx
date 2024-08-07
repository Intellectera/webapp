import * as React from "react";
import {useTranslation} from "react-i18next";
import {useCallback, useState} from "react";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import FormProvider, {RHFTextField} from "../../../components/hook-form";
import {useSettingsContext} from "../../../components/settings";
import {dataSourceTypes} from "./new-agent-select-datasource.tsx";
import {FormControlLabel, Switch} from "@mui/material";
import loadTablesList from "../../../utils/calls/db/load-tables-list.tsx";
import {CustomError} from "../../../utils/types.ts";
import {TableName} from "../../../utils/dto/TableName.ts";
import {IS_PRODUCTION} from "../../../config-global.ts";

export type DataSourceFormValuesProps = {
    host: string;
    port: number;
    username: string;
    password: string;
    databaseName: string;
};

type Props = {
    submitRef: React.RefObject<HTMLButtonElement>;
    selectedDatasource: number,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setDatasourceFormValues: React.Dispatch<React.SetStateAction<DataSourceFormValuesProps | undefined>>;
    setDatabaseTables: React.Dispatch<React.SetStateAction<TableName[]>>;
}

export default function NewAgentDatabaseForm({submitRef, selectedDatasource, setActiveStep, setIsLoading, setDatabaseTables, setDatasourceFormValues}: Props) {
    const {t} = useTranslation();
    const settings = useSettingsContext();
    const [useSSL, setUseSSL] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');

    const FormSchema = Yup.object().shape(
        {
            host: Yup.string().required(t('errors.email_required')),
            port: Yup.number().min(1, t('errors.port_required')),
            username: Yup.string().required(t('errors.username_required')),
            password: Yup.string().required(t('errors.password_required')),
            databaseName: Yup.string().required(t('errors.db_name_required')),
        }
    );

    const defaultValues = {
        host: '',
        port: 0,
        username: '',
        password: '',
        databaseName: '',
    };

    const methods = useForm<DataSourceFormValuesProps>({
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
        async (dataSourceFormValuesProps: DataSourceFormValuesProps) => {
            setErrorMsg('');
            setIsLoading(true);
            const body = {
                ...dataSourceFormValuesProps,
                useSSL: useSSL,
                databaseType: selectedDatasource
            };
            loadTablesList(body).then((data: any) => {
                const tables: string[] = data.tables;
                setIsLoading(false);
                setDatabaseTables(tables.map(table => {
                    return {name: table, selected: false};
                }));
                setDatasourceFormValues(dataSourceFormValuesProps);
                setActiveStep(prevState => prevState + 1);
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
        },
        [reset]
    );

    return (
        <>
            <div className={'w-full flex flex-col items-center justify-center my-6'}>
                <Typography className={'text-center mb-3'} variant={'h5'}>
                    {t('titles.new_agents_steps.step_2')}
                </Typography>
                {selectedDatasource === dataSourceTypes.postgresql && (
                    <img className={'mt-5 mx-3'} width={35} height={35}
                         src={settings.themeMode === 'light' ? '/assets/icons/app/postgres.png' : '/assets/icons/app/postgres-light.png'}
                         alt={'Postgresql icon'}/>
                )}
                {selectedDatasource === dataSourceTypes.mysql && (
                    <img className={'mt-5 mx-3'} width={35} height={35}
                         src={settings.themeMode === 'light' ? '/assets/icons/app/mysql.png' : '/assets/icons/app/mysql-light.png'}
                         alt={'Mysql icon'}/>
                )}
                {selectedDatasource === dataSourceTypes.sqlserver && (
                    <img className={'mt-5 mx-3'} width={35} height={35}
                         src={settings.themeMode === 'light' ? '/assets/icons/app/sql-server.png' : '/assets/icons/app/sql-server-light.png'}
                         alt={'SQL Server icon'}/>
                )}

            </div>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack className={'mb-8'}>
                    <label className="block text-sm  mb-2  ml-1 leading-6">
                        {t('labels.host')}
                    </label>
                    <RHFTextField placeholder={'95.85.75.65'} type={'text'} name="host"/>

                    <div className={'flex w-full justify-start mt-5'}>
                        <FormControlLabel  control={
                            <Switch
                                size={'medium'}
                                checked={useSSL}
                                onChange={() => setUseSSL((prevState) => !prevState)}
                                inputProps={{'aria-label': 'controlled'}}/>}
                                          label="SSL"/>
                    </div>

                    <label className="block text-sm  mt-5 mb-2 ml-1 leading-6">
                        {t('labels.port')}
                    </label>
                    <RHFTextField placeholder={'5432'} type={'number'} name="port"/>

                    <label className="block text-sm mt-5 mb-2 ml-1 leading-6">
                        {t('labels.username')}
                    </label>
                    <RHFTextField type={'text'} name="username"/>

                    <label className="block text-sm  mt-5 mb-2 ml-1 leading-6">
                        {t('password')}
                    </label>
                    <RHFTextField autoComplete='off' type={'password'} name="password"/>

                    <label className="block text-sm mt-5 mb-2 ml-1 leading-6">
                        {t('labels.db_name')}
                    </label>
                    <RHFTextField type={'text'} name="databaseName"/>


                    {/*Hidden button for submitting*/}
                    <button ref={submitRef} className={'hidden'}/>
                </Stack>
            </FormProvider>

            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        </>
    );
}
