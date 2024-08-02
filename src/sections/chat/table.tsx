import Button from "@mui/material/Button";
import DenseTable from "../../components/_common/dense-table.tsx";
import * as React from "react";
import {SetStateAction} from "react";
import {useSettingsContext} from "../../components/settings";
import {Conversation} from "../../utils/dto/Conversation.ts";
import {useTranslation} from "react-i18next";

type Props = {
    showTable: boolean,
    setShowTable: React.Dispatch<SetStateAction<boolean>>,
    index: number,
    chat: Conversation[],
    tableHeaders: string[],
    tableRows: any[]
}

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function ChatTable({showTable, setShowTable, index, chat, tableHeaders, tableRows}: Props) {
    const settings = useSettingsContext();
    const {t } = useTranslation();

    return (
        <div>
            {(showTable && index === chat.length - 1) && (
                <div
                    className={classNames('my-2 mt-5 flex', settings.themeDirection === 'rtl' ? 'flex-row' : 'flex-row-reverse')}>
                    {settings.themeDirection === 'rtl' ? (
                        <div className={'flex gap-3 justify-between'}>
                            <Button onClick={() => setShowTable(false)} variant="outlined" color="error">
                                {t('buttons.close')}
                            </Button>
                            <Button variant="outlined" color="primary">
                                {t('buttons.download')}
                            </Button>
                        </div>
                    ) : (
                        <div className={'flex gap-3 justify-between'}>
                            <Button variant="outlined" color="primary">
                                {t('buttons.download')}
                            </Button>
                            <Button onClick={() => setShowTable(false)} variant="outlined" color="error">
                                {t('buttons.close')}
                            </Button>
                        </div>
                    )}
                </div>
            )}
            {(showTable && index === chat.length - 1) && (
                <div
                    className={classNames('flex w-[100%] min-h-[150px] max-h-[250px] overflow-y-scroll scrollbar scrollbar-thumb-gray-600 scrollbar-track-transparent', settings.themeDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row')}>
                    <div className={'w-[100%] h-[100%]'}>
                        <DenseTable headers={tableHeaders} rows={tableRows}></DenseTable>
                    </div>
                </div>
            )}

        </div>
    )
}
