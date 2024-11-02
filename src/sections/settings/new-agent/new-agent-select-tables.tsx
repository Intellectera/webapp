import {Checkbox} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {useEffect, useState} from "react";
import {TableName} from "../../../utils/dto/TableName.ts";
import Alert from "@mui/material/Alert";
import {useSettingsContext} from "../../../components/settings";
import {useTranslation} from "react-i18next";

type Props = {
    databaseTables: TableName[];
    setDatabaseTables: React.Dispatch<React.SetStateAction<TableName[]>>;
    selectedTables: number[];
    setSelectedTables: React.Dispatch<React.SetStateAction<number[]>>;
    showCheckboxError: boolean;
    setShowCheckboxError: React.Dispatch<React.SetStateAction<boolean>>;
}

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function NewAgentSelectTable({databaseTables, setDatabaseTables, showCheckboxError, setShowCheckboxError, selectedTables, setSelectedTables}: Props) {
    const {t } = useTranslation();
    const settings = useSettingsContext();
    const [databaseTablesCopy, setDatabaseTablesCopy] = useState<TableName[]>([]);

    useEffect(() => {
        setDatabaseTablesCopy(databaseTables);
    }, [databaseTables])

    const onCheckboxChange = (id: number, checked: boolean) => {
        setShowCheckboxError(false);
        setSelectedTables(prev => {
            if (checked){
                return [...prev, id]
            } else {
                return prev.filter(tableId => tableId !== id);
            }
        })
    }

    const handleCheckAll = (checked: boolean) => {
        setShowCheckboxError(false);
        if (checked){
            const ids: number[] = []
            databaseTables.forEach(item => {
                ids.push(item.id)
            })
            setSelectedTables(ids);
        } else {
            setSelectedTables([]);
        }
    }

    const handleOnSearch = (value: string) => {
        if (value && value.trim().length > 0){
            setDatabaseTablesCopy(databaseTables.filter(item => item.name.includes(value)));
        } else {
            setDatabaseTablesCopy(databaseTables);
        }
    }

    return (
        <>
            <div className={'w-full flex flex-col items-center justify-center my-6'}>
                <Typography className={'text-center mb-3'} variant={'h5'}>
                    {t('titles.new_agents_steps.step_3')}
                </Typography>
            </div>

            {showCheckboxError && (
                <Alert className={'my-2'} severity="error">{t('errors.at_least_one_table')}</Alert>
            )}

            <div id={'container'} className={'w-full overflow-visible-children h-[54vh] flex justify-center items-center'}>
                <div className={classNames('w-full flex flex-col h-full border-[1px] rounded-lg',
                    settings.themeMode === 'dark' ? 'border-gray-700' : 'border-gray-300')}>
                    <div className={'flex flex-col justify-center items-start m-3'}>
                        <div className="relative w-full my-3">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="default-search"
                                   onChange={(e) => handleOnSearch(e.target.value)}
                                   className={classNames(settings.themeMode === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-gray-100 border-gray-300 focus:border-gray-400',
                                       "block w-full p-2 ps-10 text-sm border-lg rounded-sm focus:ring-blue-800")}
                                   placeholder={t('labels.search_tables')} required/>
                        </div>
                    </div>

                    <div className={classNames('w-full flex border-b-[1px]',
                        settings.themeMode === 'dark' ? 'border-gray-700' : 'border-gray-300')}>
                        <div className={'p-1 flex justify-start items-center'}>
                            <Checkbox
                                onChange={(_, checked) => handleCheckAll(checked)}
                                sx={{'& .MuiSvgIcon-root': {fontSize: 24}}}
                            />
                        </div>
                        <div className={'flex-1 flex justify-start items-center'}>
                            <Typography sx={{fontWeight: 'bolder'}}>
                                {t('labels.table_name')}
                            </Typography>
                        </div>
                    </div>

                    <div id={'table'}
                         className={'w-full flex-1 !overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent'}>

                        {databaseTablesCopy.map((table) => (
                            <div key={table.id} className={classNames('w-full flex border-b-[1px]',
                                settings.themeMode === 'dark' ? 'border-gray-700' : 'border-gray-300')}>
                                <div className={'p-1 flex justify-start items-center'}>
                                    <Checkbox
                                        onChange={(_, checked) => onCheckboxChange(table.id, checked)}
                                        checked={selectedTables.includes(table.id)}
                                        sx={{'& .MuiSvgIcon-root': {fontSize: 24}}}
                                    />
                                </div>
                                <div className={'flex-1 flex justify-start items-center'}>
                                    <Typography>
                                        {table.name}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </>
    );
}
