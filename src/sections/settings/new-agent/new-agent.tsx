import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import NewAgentSelectDatasource, {dataSourceTypes} from "./new-agent-select-datasource.tsx";
import {useEffect, useRef, useState} from "react";
import NewAgentDatabaseForm, {DataSourceFormValuesProps} from "./new-agent-database-form.tsx";
import NewAgentForm from "./new-agent-form.tsx";
import NewAgentSelectTable from "./new-agent-select-tables.tsx";
import LoadingButton from "@mui/lab/LoadingButton";
import {useSettingsContext} from "../../../components/settings";
import {useTranslation} from "react-i18next";
import {TableName} from "../../../utils/dto/TableName.ts";
import {CustomConnector, CustomStepIcon} from "./custom-stepper.tsx";
import NewAgentSuccess from "./new-agent-success.tsx";
import ExcelUploadFileView from "./excel/excel-upload-file.tsx";

const steps = {
    selectDataSource: 0,
    fillForm: 1,
    selectTables: 2,
    fillAgentForm: 3
}
const stepsArray = [steps.selectDataSource, steps.fillForm, steps.fillAgentForm, steps.selectTables];

type Props = {
    setNewAgentCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewAgentView({setNewAgentCreated}: Props) {
    const {t} = useTranslation();
    const settings = useSettingsContext();

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectedDatasource, setSelectedDatasource] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState(false);
    const [databaseTables, setDatabaseTables] = React.useState<Array<TableName>>([]);
    const [datasourceFormValues, setDatasourceFormValues] = React.useState<DataSourceFormValuesProps | undefined>(undefined);
    const [showCheckboxError, setShowCheckboxError] = React.useState<boolean>(false);
    const dataSourceFormRef = useRef<HTMLButtonElement>(null);
    const agentFormRef = useRef<HTMLButtonElement>(null);

    const handleNext = () => {
        if (activeStep === steps.fillForm && selectedDatasource !== dataSourceTypes.excel) {
            dataSourceFormRef.current!.click();
        } else if(activeStep === steps.fillForm){
            setActiveStep(prevState => prevState + 2)
        } else if (activeStep === steps.fillAgentForm) {
            agentFormRef.current!.click();
        } else if (activeStep === steps.selectTables) {
            if (databaseTables.find((item) => item.selected)) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                setShowCheckboxError(true);
            }
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const showActionButtons = () => {
        return activeStep !== steps.selectDataSource
            && activeStep !== stepsArray.length;
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
            if (prevActiveStep === steps.fillForm) {
                setSelectedDatasource(0);
            }
            if (selectedDatasource === dataSourceTypes.excel){
                return prevActiveStep - 2;
            } else {
                return prevActiveStep - 1;
            }
        });
    };

    /*Step Handlers*/
    useEffect(() => {
        if (selectedDatasource === dataSourceTypes.mysql || selectedDatasource === dataSourceTypes.postgresql ||
            selectedDatasource === dataSourceTypes.sqlserver || selectedDatasource === dataSourceTypes.oracle) {
            setActiveStep(prevState => prevState + 1);
        } else if (selectedDatasource === dataSourceTypes.excel){
            setActiveStep(prevState => prevState + 1);
        }
    }, [selectedDatasource])

    return (
        <div className={'w-full h-full flex flex-col'}>
            <Stepper className={'sm:px-10 mt-5 overflow-visible-children'} alternativeLabel={true}
                     activeStep={activeStep} connector={<CustomConnector/>}>
                {stepsArray.map((label) => {
                    return (
                        <Step key={label}>
                            <StepLabel StepIconComponent={CustomStepIcon}>
                            </StepLabel>
                        </Step>
                    )
                })}
            </Stepper>

            {/*Finished page*/}
            {activeStep === stepsArray.length ? (
                <NewAgentSuccess></NewAgentSuccess>
            ) : (
                <div
                    className={'h-[67vh] sm:h-[63vh] sm:mb-5 px-10 overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent '}>
                    {activeStep === steps.selectDataSource && (
                        <NewAgentSelectDatasource
                            setSelectedDatasource={setSelectedDatasource}></NewAgentSelectDatasource>
                    )}
                    {(activeStep === steps.fillForm && selectedDatasource !== dataSourceTypes.excel) && (
                        <NewAgentDatabaseForm setDatabaseTables={setDatabaseTables} setIsLoading={setIsLoading}
                                              setActiveStep={setActiveStep} selectedDatasource={selectedDatasource}
                                              submitRef={dataSourceFormRef}
                                              setDatasourceFormValues={setDatasourceFormValues}></NewAgentDatabaseForm>
                    )}
                    {(activeStep === steps.fillForm && selectedDatasource === dataSourceTypes.excel) && (
                        <ExcelUploadFileView></ExcelUploadFileView>
                    )}
                    {activeStep === steps.selectTables && (
                        <NewAgentSelectTable showCheckboxError={showCheckboxError}
                                             setShowCheckboxError={setShowCheckboxError} databaseTables={databaseTables}
                                             setDatabaseTables={setDatabaseTables}></NewAgentSelectTable>
                    )}
                    {activeStep === steps.fillAgentForm && (
                        <NewAgentForm submitRef={agentFormRef} setActiveStep={setActiveStep} setIsLoading={setIsLoading}
                                      selectedDatasource={selectedDatasource} databaseTables={databaseTables}
                                      datasourceFormValues={datasourceFormValues}
                                      setNewAgentCreated={setNewAgentCreated}></NewAgentForm>
                    )}
                </div>
            )}


            {showActionButtons() && (
                <div className={'px-10 mb-5 flex justify-between items-center'}>
                    <div className={'w-[45%]'}>
                        <LoadingButton
                            sx={{
                                bgcolor: (theme) => settings.themeMode === 'dark' ?
                                    theme.palette.background.neutral : theme.palette.grey[500],
                                color: 'white'
                            }}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isLoading}
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            {t('buttons.back')}
                        </LoadingButton>
                    </div>
                    <div className={'w-[45%]'}>
                        <LoadingButton
                            fullWidth
                            color="primary"
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isLoading}
                            onClick={handleNext}
                        >
                            {activeStep === stepsArray.length - 1 ? t('buttons.finish') : t('buttons.next')}
                        </LoadingButton>
                    </div>
                </div>
            )}
        </div>
    );
}
