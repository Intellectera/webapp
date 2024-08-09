import axios, {API_ENDPOINTS} from "../../axios.ts";


export default async function deleteSession(body: {agentId? :string, sessionId?: string}): Promise<boolean> {
    let result = await axios.post(API_ENDPOINTS.v1.session.delete, body);
    return result.data as boolean;
}

