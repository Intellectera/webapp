import Typography from "@mui/material/Typography";
import {useSettingsContext} from "../../../components/settings";
import * as React from "react";
import {SetStateAction} from "react";
import {useTranslation} from "react-i18next";


function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

type Props = {
    setSelectedDatasource: React.Dispatch<SetStateAction<number>>
}

export const dataSourceTypes = {
    mysql: 1,
    postgresql: 2,
    oracle: 3,
    sqlserver: 4,
    excel: 5,
    ecommerce: 6
}

export const getLogoByDatasourceType = (type: number, themeMode: 'light' | 'dark'): string => {
    if (type == dataSourceTypes.postgresql){
        return themeMode === 'light' ? '/assets/icons/app/postgres.png' : '/assets/icons/app/postgres-light.png';
    } else if (type == dataSourceTypes.mysql) {
        return themeMode === 'light' ? '/assets/icons/app/mysql.png' : '/assets/icons/app/mysql-light.png';
    } else if (type == dataSourceTypes.sqlserver) {
        return themeMode === 'light' ? '/assets/icons/app/sql-server.png' : '/assets/icons/app/sql-server-light.png';
    } else if (type == dataSourceTypes.excel) {
        return themeMode === 'light' ? '/assets/icons/app/excel.png' : '/assets/icons/app/excel-light.png';
    } else {
        return '';
    }
}

export default function NewAgentSelectDatasource({setSelectedDatasource}: Props) {
    const settings = useSettingsContext();
    const {t} = useTranslation();


    return (
        <>
            <div className={'w-full justify-center mt-6'}>
                <Typography className={'text-center'} variant={'h5'}>
                    {t('titles.new_agents_steps.step_1')}
                </Typography>
            </div>

            <div className={'grid grid-cols-1 gap-3 my-5 md:flex md:flex-col md:items-center'}>
                <div onClick={() => setSelectedDatasource(dataSourceTypes.excel)}
                     className={classNames('h-[60px] md:w-3/4 cursor-pointer border-[1px] rounded-lg flex justify-start items-center px-1',
                         settings.themeMode === 'light' ? 'bg-white hover:border-gray-400' : 'bg-gray-800 border-gray-500 hover:border-gray-300')}>
                    <img className={'mx-3'} width={35} height={35}
                         src={getLogoByDatasourceType(dataSourceTypes.excel, settings.themeMode)}
                         alt={'Excel icon'}/>
                    <Typography variant={'body1'}>
                        Excel
                    </Typography>
                </div>
                <div onClick={() => setSelectedDatasource(dataSourceTypes.postgresql)}
                     className={classNames('h-[60px] md:w-3/4 cursor-pointer border-[1px] rounded-lg flex justify-start items-center px-1',
                         settings.themeMode === 'light' ? 'bg-white hover:border-gray-400' : 'bg-gray-800 border-gray-500 hover:border-gray-300')}>
                    <img className={'mx-3'} width={35} height={35}
                         src={getLogoByDatasourceType(dataSourceTypes.postgresql, settings.themeMode)}
                         alt={'Postgresql icon'}/>
                    <Typography variant={'body1'}>
                        Postgresql
                    </Typography>
                </div>
                <div onClick={() => setSelectedDatasource(dataSourceTypes.sqlserver)}
                     className={classNames('h-[60px] md:w-3/4 cursor-pointer border-[1px] rounded-lg flex justify-start items-center px-1',
                         settings.themeMode === 'light' ? 'bg-white hover:border-gray-400' : 'bg-gray-800 border-gray-500 hover:border-gray-300')}>
                    <img className={'mx-3'} width={35} height={35}
                         src={getLogoByDatasourceType(dataSourceTypes.sqlserver, settings.themeMode)}
                         alt={'SQL Server icon'}/>
                    <Typography variant={'body1'}>
                        SQL Server
                    </Typography>
                </div>
                <div onClick={() => setSelectedDatasource(dataSourceTypes.mysql)}
                     className={classNames('h-[60px] md:w-3/4 cursor-pointer border-[1px] rounded-lg flex justify-start items-center px-1',
                         settings.themeMode === 'light' ? 'bg-white hover:border-gray-400' : 'bg-gray-800 border-gray-500 hover:border-gray-300')}>
                    <img className={'mx-3'} width={35} height={35}
                         src={getLogoByDatasourceType(dataSourceTypes.mysql, settings.themeMode)}
                         alt={'Mysql icon'}/>
                    <Typography variant={'body1'}>
                        Mysql
                    </Typography>
                </div>

                <div className={'w-full justify-center mb-3 mt-10'}>
                    <Typography className={'text-center'} variant={'h5'}>
                        {t('titles.new_agents_steps.sample_data')}
                    </Typography>
                </div>

                <div onClick={() => setSelectedDatasource(dataSourceTypes.ecommerce)}
                     className={classNames('h-[60px] md:w-3/4 cursor-pointer border-[1px] rounded-lg flex justify-start items-center px-1',
                         settings.themeMode === 'light' ? 'bg-white hover:border-gray-400' : 'bg-gray-800 border-gray-500 hover:border-gray-300')}>
                    <div className={'mx-3'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                        </svg>
                    </div>
                    <Typography variant={'body1'}>
                        Ecommerce
                    </Typography>
                </div>
            </div>


        </>
    );
}
