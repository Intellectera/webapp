import axios, {API_ENDPOINTS} from "../../axios.ts";
import {CustomerInvitation} from "../../dto/CustomerInvitation.ts";


export default async function deleteUser(body: CustomerInvitation): Promise<boolean> {
    let result = await axios.post(API_ENDPOINTS.v1.workspace.deleteUser, body);
    return result.data as boolean;
}

