import {Backdrop, Grow, Modal} from "@mui/material";
import SettingsSidebar, {settingsNavIds} from "./sidebar.tsx";
import {useSettingsContext} from "../../components/settings";
import {useState} from "react";
import NewAgentView from "./new-agent/new-agent.tsx";
import {useSelectedWorkspaceContext} from "../../layouts/dashboard/context/workspace-context.tsx";
import UsersView from "./users/users.tsx";
import GeneralView from "./GeneralView.tsx";
import AgentListView from "./edit-agent/agent-list.tsx";


// ----------------------------------------------------------------------
function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export const SettingsView = ({handleClose}: {handleClose: any}) => {
    const settings = useSettingsContext();
    const workspace = useSelectedWorkspaceContext();
    const [currentNav, setCurrentNav] = useState<string>(settingsNavIds.newAgent);
    const [newAgentCreated, setNewAgentCreated] = useState<boolean>(false);
    const menuBasedHandleClose = () => {
        if (newAgentCreated){
            /*To trigger agents loading*/
            workspace.setSelectedWorkspace(prevState => JSON.parse(JSON.stringify(prevState)));
        }
        handleClose();
    }

    return (
        <div>
            <Modal
                open={settings.open}
                onClose={menuBasedHandleClose}
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
                    style={{transformOrigin: '0 0 0'}}
                    {...((settings.open) ? {timeout: 300} : {})}
                    in={settings.open} >
                    <div className={'h-screen w-screen transition-all ease-in '}>
                        <div className={classNames(settings.themeMode === 'light' ? 'bg-white' : 'bg-gray-800',
                            'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl md:w-4/6 w-5/6 h-5/6')}>
                            <SettingsSidebar currentNav={currentNav} setCurrentNav={setCurrentNav}></SettingsSidebar>
                            {currentNav === settingsNavIds.editAgent && (
                                <AgentListView></AgentListView>
                            )}
                            {currentNav === settingsNavIds.newAgent && (
                                <NewAgentView setNewAgentCreated={setNewAgentCreated}></NewAgentView>
                            )}
                            {currentNav === settingsNavIds.users && (
                                <UsersView></UsersView>
                            )}
                            {currentNav === settingsNavIds.general && (
                                <GeneralView></GeneralView>
                            )}
                        </div>
                    </div>
                </Grow>
            </Modal>
        </div>
    );
}
