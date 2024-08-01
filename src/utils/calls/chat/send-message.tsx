import axios, {API_ENDPOINTS} from "../../axios.ts";
import {Conversation} from "../../dto/Conversation.ts";


export default async function sendMessage(body: any): Promise<Conversation> {
    let result = await axios.post(API_ENDPOINTS.v1.chat.send, body);
    return result.data as Conversation;
}

