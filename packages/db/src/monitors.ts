import { supabase } from "./client";

export async function getActiveMonitors() {
    return supabase
        .from("monitors")
        .select("*")
        .eq("paused", false);
}

export async function updateMonitorStatus(id: string, status: string) {
    return supabase
        .from("monitors")
        .update({ status, last_checked_at: new Date().toISOString() })
        .eq("id", id);
}