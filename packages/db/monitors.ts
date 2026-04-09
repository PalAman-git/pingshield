import { DB } from "./client";
import { Tables, TablesUpdate } from "./types";

type Monitor = Tables<"monitors">
type UpdateMonitor = TablesUpdate<"monitors">

export async function getActiveMonitors(db: DB): Promise<Monitor[]> {
    const { data, error } = await db.from("monitors").select("*").eq("paused", false);

    if (error) throw error;
    return data;
}

export async function updateMonitorStatus(db: DB, id: string, status: UpdateMonitor["status"]) {
    const { error } = await db
        .from("monitors")
        .update({ status })
        .eq("id", id);

    if (error) throw error;
}

export async function getDueMonitors(db: DB) {
    const { data, error } = await db
        .from("monitors")
        .select("*")
        .eq("paused", false)
        .lte("next_check_at", new Date().toISOString())
        .limit(50);
    
    if(error) throw error;

    return data;
}