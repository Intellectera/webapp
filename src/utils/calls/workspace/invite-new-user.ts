import axios, {API_ENDPOINTS} from "../../axios.ts";
import {CustomerInvitation} from "../../dto/CustomerInvitation.ts";


export default async function inviteNewUser(body: CustomerInvitation): Promise<CustomerInvitation> {
    let result = await axios.post(API_ENDPOINTS.v1.workspace.inviteUser, body);
    return result.data as CustomerInvitation;
}

