import axios, {API_ENDPOINTS} from "../../axios.ts";


export default async function getSTT(formData: FormData): Promise<{text: string}> {
    let result = await axios.post(API_ENDPOINTS.v1.chat.stt, formData);
    return result.data as {text: string};
}

