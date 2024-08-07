import Container from "@mui/material/Container";
import {useSettingsContext} from "../../components/settings";
import LoadingButton from "@mui/lab/LoadingButton";
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function EditAgentSettings() {
    const {t } = useTranslation();
    const settings = useSettingsContext();

    return (
        <Container className={'px-5 w-[100%] overflow-y-scroll scrollbar scrollbar-track-transparent'}>

            <form>

                <div className="space-y-12">
                    <div className="pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name"
                                       className="block text-sm font-medium leading-6">
                                    First name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className={classNames("block w-full rounded-md border-0 py-1.5shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                                            settings.themeMode === 'dark' ? 'bg-gray-700 ring-gray-600 focus:ring-gray-500' : 'ring-gray-300 focus:ring-gray-400')}
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name"
                                       className="block text-sm font-medium leading-6">
                                    First name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className={classNames("block w-full rounded-md border-0 py-1.5shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                                            settings.themeMode === 'dark' ? 'bg-gray-700 ring-gray-600 focus:ring-gray-500' : 'ring-gray-300 focus:ring-gray-400')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <LoadingButton
                        fullWidth
                        color="inherit"
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={false}
                    >
                        {t('buttons.save')}
                    </LoadingButton>
                </div>
            </form>
        </Container>
    );
}
