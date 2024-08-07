import * as React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useSettingsContext} from "../../../components/settings";
import {useTranslation} from "react-i18next";
import {RouterLink} from "../../../routes/components";

export default function NewAgentSuccess() {
    const settings = useSettingsContext();
    const {t } = useTranslation();

    return (
        <div className={'w-full flex justify-start items-center flex-col px-2 py-4 my-4 mx-2'}>
            <img className={'my-5'} width={100} height={100}
                 src={'/assets/icons/dashboard/check.png'}
                 alt={'Check Successful icon'}/>
            <Typography variant={'h4'} className={'font-bold'} sx={{marginY: '1rem'}}>
                {t('titles.agent_created')}
            </Typography>
            <Typography variant={'body2'} sx={{marginBottom: '2rem', width: '250px', textAlign: 'center',
            color: settings.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}}>
                {t('titles.agent_created_desc')}
            </Typography>
            <Button component={RouterLink} href="/" color={'success'} size="large" variant="contained">
                {t('buttons.ok_thanks')}
            </Button>
        </div>
    );
}
