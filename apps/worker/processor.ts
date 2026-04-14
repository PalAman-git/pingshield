import { Database } from "@repo/db"
import { createDb } from "./lib/client";

type Monitor = Database["public"]["Tables"]["monitors"]["Row"];

const db = createDb();

export async function processMonitor(monitor: Monitor) {
    const start = Date.now();

    let isUp = false;
    let latency: number | null = null
    let statusCode: number | null = null
    let errorMsg: string | null = null

    try {
        const res = await fetch(monitor.url, {
            method: monitor.method,
            signal: AbortSignal.timeout(monitor.timeout_ms),
        })

        latency = Date.now() - start;
        statusCode = res.status;
        isUp = res.ok;

    } catch (e: any) {
        errorMsg = e.message
        isUp = false
    }

    await handleResult(monitor, {
        isUp,
        latency,
        statusCode,
        errorMsg
    })
}

export async function handleResult(monitor: Monitor,
    result: {
        isUp: boolean,
        latency: number | null,
        statusCode: number | null,
        errorMsg: string | null
    }) {
    const now = new Date().toISOString();

    await db.from("checks").insert({
        monitor_id: monitor.id,
        is_up: result.isUp,
        latency_ms: result.isUp ? result.latency : null,
        status_code: result.statusCode,
        error: result.errorMsg,
        checked_at: now
    })

    //failure logic
    let failures = monitor.consecutive_failures

    if (result.isUp) {
        failures = 0
    } else {
        failures += 1
    }

    let newStatus = monitor.status

    if (result.isUp) {
        newStatus = "up"
    } else if (failures >= monitor.failure_threshold) {
        newStatus = "down"
    }

    //update monitor
    await db.from("monitors").update({
        status: newStatus,
        consecutive_failures: failures,
        last_checked_at: now,
        next_check_at: new Date(
            Date.now() + parseInt(monitor.interval_seconds) * 1000
        ).toISOString()
    })
        .eq("id", monitor.id)
}