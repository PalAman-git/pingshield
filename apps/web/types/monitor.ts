import { Database } from "@repo/db"

export type MonitorStatus = Database["public"]["Enums"]["monitor_status"];

export type Monitor = Database["public"]["Tables"]["monitors"]["Row"];