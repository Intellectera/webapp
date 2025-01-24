import axios, {API_ENDPOINTS} from "../../axios.ts";
import { ApproveWorkspace } from "../../dto/ApproveWorkspace.ts";


export default async function approveInvitation(body: {invitationId: string}): Promise<ApproveWorkspace> {
    let result = await axios.post(API_ENDPOINTS.v1.workspace.approveInvitation, body);
    return result.data as ApproveWorkspace;
}

