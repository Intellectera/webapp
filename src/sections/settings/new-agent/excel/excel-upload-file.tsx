import {useSettingsContext} from "../../../../components/settings";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {useTranslation} from "react-i18next";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {dataSourceTypes, getLogoByDatasourceType} from "../new-agent-select-datasource.tsx";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

type Props = {
    selectedFiles: File[],
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function ExcelUploadFileView({selectedFiles, setSelectedFiles}: Props) {
    const settings = useSettingsContext();
    const [showList, setShowList] = useState(false);
    const [progress, setProgress] = React.useState(0);
    const {t} = useTranslation();

    useEffect(() => {
        if (selectedFiles && selectedFiles.length > 0) {
            setShowList(true);
        } else {
            setShowList(false);
        }
    }, [selectedFiles]);

    const handleDelete = (name: string) => {
        setSelectedFiles(prevState => prevState.filter(file => file.name !== name));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prevState => prevState + 5);
        }, 1000);

        if (progress >= 100){
            clearInterval(interval)
        }

    }, []);

    return (
        <>
            <div className={'w-full justify-center my-6'}>
                <Typography className={'text-center'} variant={'h5'}>
                    {t('titles.new_agents_steps.step_2_excel')}
                </Typography>
            </div>

            {showList && (
                <div
                    className={'w-full h-[50vh] overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent'}>
                    <List
                        sx={{width: '100%', bgcolor: 'background.paper'}}
                        subheader={<ListSubheader>{t('labels.selected_files')}</ListSubheader>}
                    >
                        {selectedFiles.map((file: File, index: number) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <img className={''} width={25} height={25}
                                         src={getLogoByDatasourceType(dataSourceTypes.excel, settings.themeMode)}
                                         alt={'Excel icon'}/>
                                </ListItemIcon>
                                <ListItemText primary={file.name}/>
                                <Button onClick={() => handleDelete(file.name)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5}
                                         stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                                    </svg>
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </div>
            )}

            {!showList && (
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file"
                           className={classNames("flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer", settings.themeMode === 'light' ? " border-gray-300 bg-gray-50  hover:bg-gray-200"
                               : " bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-800")}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                className="font-semibold">{t('labels.click_to_upload')}</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">XLSX, XLS, ODF (MAX. 30MB)</p>
                        </div>
                        <input multiple={true} onChange={(event) => {
                            setSelectedFiles([...event.target.files ?? []])
                        }} accept=".xlsx,.xls,.odf" id="dropzone-file" type="file" className="hidden"/>
                    </label>
                </div>
            )}

            <div className="w-full bg-neutral-200 mt-7 rounded-xl">
                <div
                    className="bg-green-400 p-0.5 text-center font-bold rounded-xl text-sm leading-none text-white transition-[width] duration-500"
                    style={{width : `${progress}%`, maxWidth: '100%'}}>
                    {`${progress}%`}
                </div>
            </div>
        </>
    );
}
