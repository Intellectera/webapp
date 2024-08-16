import axios, {API_ENDPOINTS} from "../../axios.ts";


export type UsageData = {
    usage: Map<number, Map<number, number>>;
}

export default async function getTokenUsageData(workspaceId: string, language: string): Promise<UsageData> {
    let result = await axios.get(API_ENDPOINTS.v1.license.loadUsage, {
        params: {
            workspaceId: workspaceId,
            lang: language,
        }
    });
    const rawUsageData = result.data.usage;

    const usageMap = new Map<number, Map<number, number>>();

    for (const [outerKey, innerObj] of Object.entries(rawUsageData)) {
        const innerMap = new Map<number, number>();

        // @ts-ignore
        for (const [innerKey, value] of Object.entries(innerObj)) {
            // @ts-ignore
            innerMap.set(Number(innerKey), value);
        }

        usageMap.set(Number(outerKey), innerMap);
    }

    return { usage: usageMap };
}

