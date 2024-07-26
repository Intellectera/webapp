import axios, {API_ENDPOINTS} from "../../axios.ts";
import {Workspace} from "../../dto/Workspace.ts";

export default async function loadWorkspaces(): Promise<Array<Workspace>> {
    let result = await axios.get(API_ENDPOINTS.v1.workspace.loadAvailable);
    return result.data as Workspace[];
}
