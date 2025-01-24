import { Workspace } from "./Workspace";

export type ApproveWorkspace = {
    invitationId: string;
    accountExists: boolean;
    workspace: Workspace;
    email: string;
};