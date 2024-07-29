import {Backdrop, Modal} from "@mui/material";
import SettingsSidebar from "./sidebar.tsx";
import {useSettingsContext} from "../../components/settings";
import {useEffect, useState} from "react";
import {Agent} from "../../utils/dto/Agent.ts";
import {useSelectedWorkspaceContext} from "../../layouts/dashboard/context/workspace-context.tsx";
import loadAgents from "../../utils/calls/agent/load-agents.ts";

// ----------------------------------------------------------------------
function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export const SettingsView = ({handleClose, open}: {handleClose: any, open: boolean}) => {
    const settings = useSettingsContext();
    const selectedWorkspace = useSelectedWorkspaceContext();

    const [agents, setAgents] = useState<Array<Agent>>([]);

    useEffect(() => {
        if (selectedWorkspace.selectedWorkspace){
            loadAgents(selectedWorkspace.selectedWorkspace.id!).then((result) => {
                setAgents(result);
            })
        }
    }, [selectedWorkspace.selectedWorkspace])

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
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
                <div className={'h-screen w-screen transition-all ease-in '}>
                    <div className={classNames(settings.themeMode === 'light' ? 'bg-white' : 'bg-gray-800',
                        'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl w-5/6 h-4/6')}>
                        <SettingsSidebar agents={agents} handleClose={handleClose}></SettingsSidebar>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
