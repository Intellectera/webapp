import axios, {API_ENDPOINTS} from "../../axios.ts";
import {Session} from "../../dto/Session.ts";


export default async function updateSession(body: Session): Promise<boolean> {
    let result = await axios.post(API_ENDPOINTS.v1.session.update, body);
    return result.data as boolean;
}

