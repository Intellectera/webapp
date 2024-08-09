import Typography from "@mui/material/Typography";
import * as React from "react";
import {useTranslation} from "react-i18next";

export default function GeneralView() {
    const {t} = useTranslation();

    return (
        <div className={'w-full h-full flex flex-col'}>
            <div className={'w-full flex flex-col items-center justify-center my-6'}>
                <Typography className={'text-center mb-3'} variant={'h5'}>
                    {t('titles.general_settings')}
                </Typography>
            </div>

            <div
                className={'h-[62vh] sm:mb-5 px-10 sm:px-48 overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent'}>
                <div className={'w-full flex flex-col items-center justify-center'}>
                    <div className={'w-full flex items-center justify-between'}>
                        <div>Title</div>
                        <button>Button</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
