import axios, {API_ENDPOINTS} from "../../axios.ts";


export default async function recoverPassword(body: {token: string, password: string}): Promise<boolean> {
    let result = await axios.post(API_ENDPOINTS.v1.auth.recoverPassword, body);
    return result.data as boolean;
}

