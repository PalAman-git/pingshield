import { supabase } from "./client";

export async function insertCheck(data: {
    monitor_id: string;
    is_up: boolean;
    status_code?: number;
    latency_ms?: number;
    error?: string;
}) {
    return supabase.from("checks").insert({
        ...data,
        checked_at: new Date().toISOString(),
    });
}