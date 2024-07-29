import axios, {API_ENDPOINTS} from "../../axios.ts";
import {Agent} from "../../dto/Agent.ts";


export default async function loadAgents(workspaceId: string): Promise<Array<Agent>> {
    let result = await axios.get(API_ENDPOINTS.v1.agent.load, {
        params: {
            workspaceId: workspaceId,
        }
    });
    return result.data as Agent[];
}

