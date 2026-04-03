export type PingResult = {
    status: "up" | "down";
    responseTime: number | null;
};

export async function ping(url: string): Promise<PingResult> {
    const start = Date.now();

    try {
        const res = await fetch(url);

        return {
            status: res.status < 400 ? "up" : "down",
            responseTime: Date.now() - start,
        };
    } catch {
        return {
            status: "down",
            responseTime: null
        }
    }
}