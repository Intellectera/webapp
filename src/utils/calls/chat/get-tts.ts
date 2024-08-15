import axios, {API_ENDPOINTS} from "../../axios.ts";


export default async function getTTS(body: {text: string}): Promise<any> {
    let result = await axios.post(API_ENDPOINTS.v1.chat.tts, body, {
        responseType: 'blob'
    });
    return result.data;
}

