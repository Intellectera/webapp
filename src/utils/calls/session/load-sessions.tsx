import axios, {API_ENDPOINTS} from "../../axios.ts";
import {Session} from "../../dto/Session.ts";


export default async function loadSessions(agentId: string): Promise<Array<Session>> {
    let result = await axios.get(API_ENDPOINTS.v1.session.load, {
        params: {
            agentId: agentId,
        }
    });
    return result.data as Session[];
}

