import { Backdrop, Grow, Modal } from "@mui/material";
import { useSettingsContext } from "../../components/settings";
import MonthlyUsage from "./monthly-usage";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

type Props = {
    openUsage: boolean;
    setOpenUsage: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UsageView({ openUsage, setOpenUsage }: Props) {
    const settings = useSettingsContext();

    return (
        <div>
            <Modal
                open={openUsage}
                onClose={() => setOpenUsage(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 200,
                    },
                }}
            >
                <Grow
                    style={{ transformOrigin: '0 0 0' }}
                    {...((openUsage) ? { timeout: 300 } : {})}
                    in={openUsage} >
                    <div className={'h-screen w-screen transition-all ease-in '}>
                        <div className={classNames(settings.themeMode === 'light' ? 'bg-white' : 'bg-gray-800', 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl w-5/6 sm:w-4/6 h-4/6')}>
                            <MonthlyUsage></MonthlyUsage>
                        </div>
                    </div>
                </Grow>
            </Modal>
        </div>
    );
}