import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

import {
    insertMonitor,
    getMonitorById,
    getMonitors,
    updateMonitor,
    deleteMonitor,
} from "@repo/db";

import { getMonitorQueue } from "@repo/queue"


export async function GET() {
    const db = await createClient();

    try {
        const monitors = await getMonitors(db);
        return NextResponse.json({ data: monitors });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || 'Failed to fetch monitors' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    const db = await createClient();
    const { data: { user }, } = await db.auth.getUser();

    if (!user) {
        return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    try {
        const body = await req.json();

        // 1. Insert monitor
        const monitor = await insertMonitor(db, {...body,user_id:user.id});

        const intervalMs = parseInt(monitor.interval_seconds) * 1000;

        // 2. Schedule job
        await getMonitorQueue().add(
            "check-monitor",
            { monitorId: monitor.id },
            {
                repeat: {
                    every: intervalMs,
                },
                jobId: `monitor-${monitor.id}`,
            }
        );

        return NextResponse.json({ data: monitor });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Failed to create monitor" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    const db = await createClient();

    try {
        const body = await req.json();
        const { id, interval_seconds, ...rest } = body;

        // 1. Get existing monitor
        const existing = await getMonitorById(db, id);

        if (!existing) {
            return NextResponse.json(
                { error: "Monitor not found" },
                { status: 404 }
            );
        }

        // 2. Remove old job
        await getMonitorQueue().removeJobScheduler(
            `monitor-${id}`
        );

        // 3. Update DB
        const updated = await updateMonitor(db, id, {
            ...rest,
            interval_seconds,
        });

        const intervalMs = parseInt(updated.interval_seconds) * 1000;

        // 4. Add new job
        await getMonitorQueue().add(
            "check-monitor",
            { monitorId: id },
            {
                repeat: {
                    every: intervalMs,
                },
                jobId: `monitor-${id}`,
            }
        );

        return NextResponse.json({ data: updated });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Failed to update monitor" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    const db = await createClient();

    try {
        const body = await req.json();
        const { id } = body;

        // 1. Get monitor
        const existing = await getMonitorById(db, id);

        if (!existing) {
            return NextResponse.json(
                { error: "Monitor not found" },
                { status: 404 }
            );
        }

        // 2. Remove job
        await getMonitorQueue().removeJobScheduler(
            `monitor-${id}`
        );

        // 3. Delete from DB
        await deleteMonitor(db, id);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Failed to delete monitor" },
            { status: 500 }
        );
    }
}
