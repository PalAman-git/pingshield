import { createDb } from "./lib/client"
import { getDueMonitors } from "@repo/db";
import { processMonitor } from "./processor";

const db = createDb();

async function runCycle(){
    const monitors = await getDueMonitors(db);

    await Promise.all(
        monitors.map((m) => processMonitor(m))
    )
}

async function main(){
    console.log("Worker started...")
    while(true){
        try{
            runCycle()
        }catch(err){
            console.log("Worker error:",err)
        }

        await new Promise((r) => setTimeout(r,5000))
    }
}

main();