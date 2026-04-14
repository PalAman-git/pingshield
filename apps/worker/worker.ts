import { Worker } from "bullmq";
import IORedis from 'ioredis';
import { processMonitor } from "./processor";
import { createDb } from "./lib/client";

const connection = new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
});

const db = createDb();

const worker = new Worker(
    "monitor-queue",
    async (job) => {
        const { monitorId } = job.data;

        const { data: monitor } = await db
            .from("monitors")
            .select("*")
            .eq("id", monitorId)
            .single();

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