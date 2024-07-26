import {Workspace} from "./Workspace";

export class InvitationApprove {
  invitationId: string;
  accountExists: boolean;
  workspace: Workspace;
  email: string;
}
