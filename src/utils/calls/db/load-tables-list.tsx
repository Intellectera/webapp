import axios, {API_ENDPOINTS} from "../../axios.ts";


export default async function loadTablesList(body: any): Promise<Array<string>> {
    let result = await axios.post(API_ENDPOINTS.v1.db.loadTablesList, body);
    return result.data as Array<string>;
}

