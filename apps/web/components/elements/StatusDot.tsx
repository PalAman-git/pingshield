import { MonitorStatus } from "@/types/monitor"

type StatusBadgeProps = {
    status: MonitorStatus
}

export function StatusDot({ status }: StatusBadgeProps) {
    if (status === "up") {
        return (
            <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
        )
    }
    if (status === "down") {
        return (
            <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-400" />
            </span>
        )
    }
    if (status === "paused") {
        return <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
    }
    return <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400" />
}