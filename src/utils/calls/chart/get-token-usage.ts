import axios, {API_ENDPOINTS} from "../../axios.ts";


export type UsageData = {
    organizationUsage: Map<number, Map<number, number>>;
    workspaceUsage: Map<number, Map<number, number>>;
}

export default async function getTokenUsageData(workspaceId: string, language: string): Promise<UsageData> {
    let result = await axios.get(API_ENDPOINTS.v1.usage.report, {
        params: {
            workspaceId: workspaceId,
            lang: language,
        }
    });

    const workspaceUsage = new Map<number, Map<number, number>>();
    for (const [outerKey, innerObj] of Object.entries(result.data.workspaceUsage)) {
        const innerMap = new Map<number, number>();
        // @ts-ignore
        for (const [innerKey, value] of Object.entries(innerObj)) {
            // @ts-ignore
            innerMap.set(Number(innerKey), value);
        }
        workspaceUsage.set(Number(outerKey), innerMap);
    }

    const organizationUsage = new Map<number, Map<number, number>>();
    for (const [outerKey, innerObj] of Object.entries(result.data.organizationUsage)) {
        const innerMap = new Map<number, number>();
        // @ts-ignore
        for (const [innerKey, value] of Object.entries(innerObj)) {
            // @ts-ignore
            innerMap.set(Number(innerKey), value);
        }
        organizationUsage.set(Number(outerKey), innerMap);
    }

    return { workspaceUsage, organizationUsage };
}

