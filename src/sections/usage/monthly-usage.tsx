import { useSettingsContext } from '../../components/settings';
import { useEffect, useState } from 'react';
import getTokenUsageData, { UsageData } from '../../utils/calls/chart/get-token-usage';
import { useSelectedWorkspaceContext } from '../../layouts/dashboard/context/workspace-context';
import { daysInMonth, monthsInEnglish, monthsInPersian } from '../../utils/data-util';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useTranslation } from "react-i18next";
import { Button, Typography } from '@mui/material';


export default function MonthlyUsage() {
    const settings = useSettingsContext();
    const { selectedWorkspace } = useSelectedWorkspaceContext();
    const [month, setMonth] = useState<number>(1);
    const [totalTokens, setTotalTokens] = useState<number>(0);
    const [monthUsage, setMonthUsage] = useState<Array<{ usage: number, label: string }>>([]);
    const [usageData, setUsageData] = useState<UsageData>();
    const [selectedUsageData, setSelectedUsageData] = useState<"workspace" | "organization">("workspace");
    const { t, i18n: { language } } = useTranslation();


    useEffect(() => {
        getTokenUsageData(selectedWorkspace!.id!, language).then((usageData: UsageData) => {
            setUsageData(usageData);
        })
    }, []);

    useEffect(() => {
        if (usageData) {
            const usageMap = selectedUsageData === "workspace" ? usageData?.workspaceUsage : usageData?.organizationUsage;
            if (usageMap.size > 0) {
                const firstMonth: number = Array.from(usageMap.keys())[0];
                setMonth(firstMonth);
                updateMonth(firstMonth, usageMap);
            }
        }
    }, [usageData]);

    useEffect(() => {
        const usageMap = selectedUsageData === "workspace" ? usageData?.workspaceUsage : usageData?.organizationUsage;
        if (usageMap) {
            if (usageMap.size > 0) {
                const firstMonth: number = Array.from(usageMap.keys())[0];
                setMonth(firstMonth);
                updateMonth(firstMonth, usageMap);
            }
        }
    }, [selectedUsageData])

    const updateMonth = (monthNumber: number, usageMap: Map<number, Map<number, number>>) => {
        const monthUsageArr: any[] = [];
        let total = 0;
        if (usageMap) {
            for (let i = 1; i <= daysInMonth[monthNumber]; i++) {
                const usageAmount = usageMap.get(monthNumber)?.get(i) ?? 0;
                total += usageAmount;
                monthUsageArr.push({ usage: usageAmount, label: `${i}` })
            }
        }
        setTotalTokens(total);
        setMonthUsage(monthUsageArr);
    }

    const handlePrevious = () => {
        setMonth(prev => {
            if (prev == 1) {
                return 1;
            }
            return prev - 1;
        })
    }

    const handleNext = () => {
        setMonth(prev => {
            if (prev == 12) {
                return 12;
            }
            return prev + 1;
        })
    }

    const valueFormatter = (value: number | null) => `${value} ${t('labels.tokens')}`;

    const chartSetting = {
        yAxis: [
            {
                label: '',
            },
        ],
        series: [{ dataKey: 'usage', valueFormatter }],
        height: 300,
        sx: {
            [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
                transform: 'translateX(-10px)',
            },
        },
    };

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <div className='d-flex justify-center items-center my-5'>
                <Button style={{ margin: 5 }} onClick={() => { setSelectedUsageData("workspace") }} variant={selectedUsageData == "workspace" ? 'contained' : 'outlined'} color={'info'}>
                    {t('labels.workspace')}
                </Button>
                <Button style={{ margin: 5 }} onClick={() => { setSelectedUsageData("organization") }} variant={selectedUsageData == "organization" ? 'contained' : 'outlined'} color={'info'}>
                    {t('labels.organization')}
                </Button>
            </div>
            <div className=''>
                <Typography sx={{
                    color: settings.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                }} variant='h6'>
                    {`${t('labels.total')}: ${totalTokens} ${t('labels.tokens')}`}
                </Typography>
            </div>
            <div className='w-[90%]'>
                <BarChart
                    dataset={monthUsage}
                    xAxis={[
                        { scaleType: 'band', dataKey: 'label', tickPlacement: 'middle', tickLabelPlacement: 'middle' },
                    ]}
                    {...chartSetting}
                />
            </div>

            <div className='flex justify-center items-center gap-1'>
                <div onClick={handlePrevious} className='cursor-pointer flex justify-center items-center aspect-square rounded-lg w-8 border-[0.5px] border-gray-700'>
                    {settings.themeDirection === 'ltr' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    )}
                </div>

                <div className='flex justify-center items-center  rounded-lg h-8 w-40 border-[0.5px] border-gray-700'>
                    {language === 'en' ? monthsInEnglish[month] : monthsInPersian[month]}
                </div>

                <div onClick={handleNext} className='cursor-pointer flex justify-center items-center aspect-square rounded-lg w-8 border-[0.5px] border-gray-700'>
                    {settings.themeDirection === 'ltr' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
}