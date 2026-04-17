import { Queue } from "bullmq";
import { getConnection } from "./connection";

let queue: Queue | null = null;

export function getMonitorQueue() {
  if (!queue) {
    queue = new Queue("monitor-queue", {
      connection: getConnection(),
    });
  }
  return queue;
}