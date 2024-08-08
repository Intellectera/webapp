import axios, {API_ENDPOINTS} from "../../axios.ts";
import {CustomerInvitation} from "../../dto/CustomerInvitation.ts";


export default async function loadWorkspaceUsers(workspaceId: string): Promise<Array<CustomerInvitation>> {
    let result = await axios.get(API_ENDPOINTS.v1.workspace.loadWorkspaceUsers, {
        params: {
            workspaceId: workspaceId,
        }
    });
    return result.data as CustomerInvitation[];
}

