import axios, {API_ENDPOINTS} from "../../axios.ts";


export default async function forgetPassowrd(body: {email: string}): Promise<boolean> {
    let result = await axios.post(API_ENDPOINTS.v1.auth.forgetPassowrd, body);
    return result.data as boolean;
}

