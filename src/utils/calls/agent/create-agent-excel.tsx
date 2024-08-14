import axios, {API_ENDPOINTS} from "../../axios.ts";
import {Agent} from "../../dto/Agent.ts";


export default async function createExcelAgent(formData: FormData): Promise<Agent> {
    let result = await axios.post(API_ENDPOINTS.v1.agent.createExcel, formData);
    return result.data as Agent;
}

