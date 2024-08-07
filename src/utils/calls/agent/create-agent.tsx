import axios, {API_ENDPOINTS} from "../../axios.ts";
import {Agent} from "../../dto/Agent.ts";


export default async function createAgent(body: any): Promise<Agent> {
    let result = await axios.post(API_ENDPOINTS.v1.agent.create, body);
    return result.data as Agent;
}

