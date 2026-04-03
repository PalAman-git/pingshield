export type MonitorRow = {
    id: string;
    user_id: string;
    url: string;
    cacheStatus: string;
    interval_seconds: number;
    last_checked_at: string | null;
}

export type Check = {
    id: string;
    monitor_id: string;
    is_up: boolean;
    status_code: number | null;
    latency_ms: number | null;
    checked_at: string;
}