import axios, {API_ENDPOINTS} from "../../axios.ts";
import {Agent} from "../../dto/Agent.ts";


export default async function deleteAgent(body: {id: string}): Promise<Agent> {
    let result = await axios.post(API_ENDPOINTS.v1.agent.delete, body);
    return result.data as Agent;
}

