export type Monitor = {
    id: string;
    url: string;
    interval: number;
    cacheStatus:"up" | "down";
    next_check_at: string;
};

export type CheckInsert = {
    monitor_id: string;
    status: "up" | "down";
    response_time: number | null;
};