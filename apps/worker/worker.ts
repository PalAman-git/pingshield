import { Worker } from "bullmq";
import { processMonitor } from "./processor.js";
import { createDb } from "./lib/client.js";
import { getConnection } from "@repo/queue"
import { getMonitorById } from "@repo/db"


const db = createDb();
const connection = getConnection();

const worker = new Worker(
    "monitor-queue",
    async (job) => {
        const { monitorId } = job.data;

        const monitor = await getMonitorById(db,monitorId);

        await processMonitor(monitor);
    },
    { connection }
);

worker.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`);
})

worker.on('failed', (job, err) => {
    console.error(`Job failed: ${job?.id}`, err);
})