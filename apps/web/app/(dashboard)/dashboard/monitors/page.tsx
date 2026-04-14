"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Plus, Search, RefreshCw, ExternalLink, MoreHorizontal,
  Pause, Trash2, Pencil, AlertCircle, TrendingUp, Activity,
  Shield, Wifi, WifiOff, PauseCircle, Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { Constants, Database, getActiveMonitors } from "@repo/db"
import { createClient } from "@/lib/supabase/client"
import { Monitor } from "@/types/monitor"
import { insertMonitor } from "@/lib/api/monitors"

const pingIntervals = Constants.public.Enums.ping_intervals
const httpMethods = Constants.public.Enums.http_method
type FilterStatus = Database["public"]["Enums"]["monitor_status"] | "all"

/* ────────────────────────────────────────────────────────────
   Status primitives
──────────────────────────────────────────────────────────── */

function StatusDot({ status }: { status: string }) {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      {status === "up" && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
      )}
      <span className={cn(
        "relative inline-flex h-2 w-2 rounded-full",
        status === "up" && "bg-emerald-400",
        status === "down" && "bg-red-400",
        status === "paused" && "bg-zinc-600",
      )} />
    </span>
  )
}

/* ────────────────────────────────────────────────────────────
   Uptime mini-bar
──────────────────────────────────────────────────────────── */

function HourlyStatusBars({ status }: { status: "up" | "down" | "paused" | "pending" }) {
  // mock for now → later replace with real checks data
  const bars = Array.from({ length: 24 }, () => {
    const rand = Math.random()

    if (status === "down") return rand > 0.3 ? "down" : "up"
    if (status === "paused") return "paused"
    return rand > 0.95 ? "down" : "up"
  })

  return (
    <div className="flex items-center gap-[2px] mt-1">
      {bars.map((b, i) => (
        <div
          key={i}
          className={cn(
            "h-5 w-[3px] rounded-sm",
            b === "up" && "bg-emerald-400/80",
            b === "down" && "bg-red-400/80",
            b === "paused" && "bg-zinc-700"
          )}
        />
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Summary chips
──────────────────────────────────────────────────────────── */

function SummaryChip({
  label, value, icon: Icon, color,
}: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-zinc-500">{label}</p>
        <Icon className={cn("h-3.5 w-3.5", color)} />
      </div>
      <p className={cn("mt-1.5 text-2xl font-semibold tracking-tight", color)}>{value}</p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Monitor row
──────────────────────────────────────────────────────────── */

function MonitorRow({ monitor }: { monitor: Monitor }) {
  return (
    <div
      className={cn(
        "group grid items-center px-5 py-4",
        "grid-cols-[minmax(220px,2fr)_120px_120px_1fr_120px_40px]",
        "border-t border-zinc-800/50",
        "hover:bg-zinc-900/40 transition"
      )}
    >
      {/* NAME */}
      <div className="flex items-center gap-3 min-w-0">
        <StatusDot status={monitor.status} />

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-200">
            {monitor.name}
          </p>
          <p className="truncate text-xs text-zinc-600 font-mono">
            {monitor.url}
          </p>
        </div>
      </div>

      {/* UPTIME */}
      <div>
        <p className="text-sm font-semibold text-emerald-400">
          {monitor.avg_uptime?.toFixed(2)}%
        </p>
        <p className="text-[10px] text-zinc-600">30d</p>
      </div>

      {/* 24H BARS (FIXED LOOK) */}
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: 24 }).map((_, i) => {
          const rand = Math.random()
          const color =
            monitor.status === "paused"
              ? "bg-zinc-700"
              : rand > 0.9
                ? "bg-red-400"
                : "bg-emerald-400"

          return (
            <div
              key={i}
              className={cn(
                "h-6 w-[4px] rounded-sm",
                color,
                "opacity-80"
              )}
            />
          )
        })}
      </div>

      {/* LATENCY */}
      <div>
        <p className="text-sm font-semibold text-zinc-300">
          {monitor.avg_latency_ms ?? "—"}
          {monitor.avg_latency_ms && (
            <span className="text-xs text-zinc-600 ml-1">ms</span>
          )}
        </p>
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <MoreHorizontal className="h-4 w-4 text-zinc-600" />
      </div>
    </div>
  )
}


/* ────────────────────────────────────────────────────────────
   Add monitor dialog
──────────────────────────────────────────────────────────── */

function AddMonitorDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState("300");
  const [method, setMethod] = useState("GET");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!url) return;

    setLoading(true);

    try {
      await insertMonitor({
        name,
        url,
        method,
        interval_seconds: Number(interval),
      });

      // reset form
      setName("");
      setUrl("");
      setInterval("300");
      setMethod("GET");

      // close dialog
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-8 gap-1.5 bg-violet-600 text-xs font-medium text-white hover:bg-violet-500 shadow-lg shadow-violet-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          Add monitor
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-zinc-100">New monitor</DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            We'll check your URL every 60 seconds and alert you instantly on failure.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-400">Name</Label>
            <Input
              placeholder="My API"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-400">URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/health"
              className="h-9 border-zinc-700 bg-zinc-800 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-400">Check every</Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-300 focus:ring-violet-500/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-800">
                  {pingIntervals.map((interval) => (
                    <SelectItem key={interval} value={interval} className="text-sm text-zinc-300">
                      {interval === "30" ? "30 seconds"
                        : interval === "60" ? "60 seconds"
                          : interval === "300" ? "5 minutes"
                            : "10 minutes"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-400">Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-300 focus:ring-violet-500/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-800">
                  {httpMethods.map((method) => (
                    <SelectItem key={method} value={method} className="text-sm text-zinc-300">
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost" size="sm" onClick={() => setOpen(false)}
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} size="sm" className="bg-violet-600 text-white hover:bg-violet-500">
            {loading ? "Creating..." : "Create Monitor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────── */

export default function MonitorsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const db = createClient()

  useEffect(() => {
    async function load() {
      const data = await getActiveMonitors(db)
      setMonitors(data)
    }
    load()
  }, [])

  if (!monitors) return null

  const filtered = monitors.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.url?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || m.status === filter
    return matchesSearch && matchesFilter
  })

  // Derived summary stats
  const upCount = monitors.filter((m) => m.status === "up").length
  const downCount = monitors.filter((m) => m.status === "down").length
  const avgUptime = monitors.length
    ? monitors.reduce((acc, m) => acc + (m.avg_uptime ?? 0), 0) / monitors.length
    : 0

  const summaryChips = [
    { label: "Total monitors", value: String(monitors.length), icon: Activity, color: "text-zinc-400" },
    { label: "Operational", value: String(upCount), icon: Shield, color: "text-emerald-400" },
    { label: "Down now", value: String(downCount), icon: AlertCircle, color: "text-red-400" },
    { label: "Avg uptime", value: `${avgUptime.toFixed(2)}%`, icon: TrendingUp, color: "text-violet-400" },
  ]

  return (
    <div className="space-y-6">

      {/* Summary chips */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryChips.map((chip) => (
          <SummaryChip key={chip.label} {...chip} />
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
            <Input
              placeholder="Search monitors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-64 border-zinc-800 bg-zinc-900 pl-8 text-sm text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-violet-500/50"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
            {(["all", "up", "down", "paused"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                  filter === f
                    ? "bg-violet-600/20 text-violet-300 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost" size="sm"
            className="h-8 gap-1.5 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
          <AddMonitorDialog />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-sm">
        {/* Purple accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

        <div className="divide-y divide-zinc-800/40">
          {filtered.map((monitor) => (
            <MonitorRow key={monitor.id} monitor={monitor} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
              <Activity className="h-5 w-5 text-zinc-700" />
            </div>
            <p className="text-sm font-medium text-zinc-500">No monitors found</p>
            <p className="mt-1 text-xs text-zinc-700">
              {search ? "Try a different search term" : "Add your first monitor to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-zinc-700">
        Using {upCount} of 3 monitors on the free plan.{" "}
        <span className="cursor-pointer text-violet-500 transition-colors hover:text-violet-400">
          Upgrade for unlimited monitors →
        </span>
      </p>
    </div>
  )
}