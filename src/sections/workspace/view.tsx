import {Backdrop, Modal} from "@mui/material";
import {useSettingsContext} from "../../components/settings";
import Typography from "@mui/material/Typography";
import Iconify from "../../components/iconify";
import loadWorkspaces from "../../utils/calls/workspace/load-workspaces.ts";
import {useContext, useState} from "react";
import {Workspace} from "../../utils/dto/Workspace.ts";
import {
    SelectedWorkspaceContext,
    SelectedWorkspaceContextValue, WORKSPACE_STORAGE_KEY
} from "../../layouts/dashboard/context/workspace-provider.tsx";
import {localStorageSetItem} from "../../utils/storage-available.ts";

// ----------------------------------------------------------------------
function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export const ChangeWorkspaceView = ({handleClose, open}: { handleClose: any, open: boolean }) => {
    const settings = useSettingsContext();
    const [workspaces, setWorkspaces] = useState<Array<Workspace>>([]);
    const value: SelectedWorkspaceContextValue = useContext(SelectedWorkspaceContext);


    loadWorkspaces().then((result) => {
        setWorkspaces(result);
    })

    const handleSelectWorkspace = (workspace: Workspace) => {
        localStorageSetItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
        value.setSelectedWorkspace(workspace);
        window.location.reload();
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{backdrop: Backdrop}}
                slotProps={{
                    backdrop: {
                        timeout: 200,
                    },
                }}
            >
                <div className={'h-screen w-screen transition-all ease-in '}>
                    <div className={classNames(settings.themeMode === 'light' ? 'bg-white' : 'bg-gray-800',
                        'absolute overflow-scroll top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl w-5/6 h-5/6  md:w-5/6 md:h-5/6 lg:w-2/6 lg:h-4/6')}>
                        <div onClick={handleClose}
                             className={'w-100 hover:cursor-pointer relative flex items-center justify-end mt-5 mr-5'}>
                            <Iconify icon="gridicons:cross" width={24}/>
                        </div>

                        <div className={'w-100 flex justify-center items-center'}>
                            <Typography className={'text-center w-100'} variant="h6" gutterBottom>
                                Change Workspace
                            </Typography>
                        </div>

                        {workspaces.map((workspace: Workspace, index: number) => (
                            <div className={'w-100 grid grid-cols-2 gap-5 m-8 overflow-scroll'} key={index}>
                                <div key={index} onClick={() => handleSelectWorkspace(workspace)}
                                     className={'aspect-square flex items-center justify-center p-1 rounded-lg  border-2 cursor-pointer transition-colors ease-in delay-25 border-gray-200 hover:bg-gray-300'}>
                                    <Typography key={index} fontWeight={'bold'} className={'text-center'} variant="body2"
                                                gutterBottom>
                                        {workspace.name}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
