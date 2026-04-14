import { monitorQueue } from "./queue";
import { createDb } from "./lib/client";

const db = createDb();

async function scheduleJobs(){
    const {data:monitors} = await db
        .from("monitors")
        .select("*");

    for(const monitor of monitors || []){
        await monitorQueue.add(
            "check-monitor",
            {monitor_id:monitor.id},
            {
                repeat:{
                    every:parseInt(monitor.interval_seconds) * 1000,
                },
                jobId:`monitor-${monitor.id}`
            }
        )
    }
}

scheduleJobs();

//Run this once (or on monitor create/update)