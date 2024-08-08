import axios, {API_ENDPOINTS} from "../../axios.ts";
import {Conversation} from "../../dto/Conversation.ts";


export default async function loadChat(sessionId: string): Promise<Array<Conversation>> {
    let result = await axios.get(API_ENDPOINTS.v1.chat.load, {
        params: {
            sessionId: sessionId,
        }
    });
    return result.data as Conversation[];
}

