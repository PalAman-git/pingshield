export type InsertMonitorInput = {
    name: string,
    url: string;
    method?: string;
    interval_seconds: number;
};

export async function insertMonitor(data: InsertMonitorInput) {
    const res = await fetch("/api/monitors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create monitor");
    }

    return res.json();
}