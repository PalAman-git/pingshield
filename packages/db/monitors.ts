import { DB } from "./client";
import { Database } from "./types";

type Monitor = Database["public"]["Tables"]["monitors"]["Row"];
type InsertMonitor = Database["public"]["Tables"]["monitors"]["Insert"];
type UpdateMonitorInput = Partial<Monitor>;

export async function getActiveMonitors(db: DB): Promise<Monitor[]> {
    const { data, error } = await db.from("monitors").select("*").eq("paused", false);

    if (error) throw error;
    return data;
}

export async function getMonitors(db: DB): Promise<Monitor[]> {
    const { data, error } = await db
        .from("monitors")
        .select("*");

    if (error) {
        console.error("getMonitors error:", error);
        throw error;
    }

    return data || [];
}

export async function getMonitorById(db: DB, id: string): Promise<Monitor | null> {
    const { data, error } = await db
        .from("monitors")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        //Supabase throws error if not found
        if (error.code === "PGRST116") {
            return null;
        }

        console.error("getMonitorById error:", error);
        throw error;
    }

    return data;
}

export async function updateMonitor(db: DB, id: string, updates: UpdateMonitorInput): Promise<Monitor> {
    const { data, error } = await db
        .from("monitors")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("updateMonitor error:", error);
        throw error;
    }

    return data;
}

export async function deleteMonitor(db: DB, id: string): Promise<void> {
    const { error } = await db
        .from("monitors")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("deleteMonitor error:", error);
        throw error;
    }
}

export async function insertMonitor(db: DB, body: InsertMonitor) {
    const { data: monitor, error } = await db
        .from("monitors")
        .insert(body)
        .select()
        .single()

    if (error) {
        console.error("Insert monitor failed:", error);
        throw error;
    }

    return monitor;
}