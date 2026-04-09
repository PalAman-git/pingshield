"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  RefreshCw,
  ExternalLink,
  MoreHorizontal,
  Pause,
  Trash2,
  Pencil,
  Circle,
  AlertCircle,
  Clock,
  TrendingUp,
  Activity,
  Globe,
  Shield,
  ChevronUp,
  ChevronDown,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { StatusDot } from "@/components/elements/StatusDot"

import { Constants, Database, getActiveMonitors } from "@repo/db"
import { createClient } from "@/lib/supabase/client"
import { Monitor } from "@/types/monitor"


const pingIntervals = Constants.public.Enums.ping_intervals;
type FilterStatus = Database["public"]["Enums"]["monitor_status"] | "all";


const stats = [
  { label: "Total monitors", value: "5", icon: Activity, color: "text-zinc-400" },
  { label: "Operational", value: "3", icon: Shield, color: "text-emerald-400" },
  { label: "Down now", value: "1", icon: AlertCircle, color: "text-red-400" },
  { label: "Avg uptime", value: "99.44%", icon: TrendingUp, color: "text-blue-400" },
]


function UptimeBars({ uptime }: { uptime: number }) {
  // Generate 30 mock bars
  const bars = Array.from({ length: 30 }, (_, i) => {
    const rand = Math.random()
    if (uptime > 99.9 && rand > 0.99) return "incident"
    if (uptime > 99 && rand > 0.98) return "incident"
    if (uptime > 95 && rand > 0.96) return "incident"
    return "ok"
  })

  return (
    <div className="flex items-center gap-0.5">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={cn(
            "h-5 w-1 rounded-sm",
            bar === "ok" ? "bg-emerald-500/70" : "bg-red-500/70"
          )}
        />
      ))}
    </div>
  )
}

function AddMonitorDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-8 gap-1.5 bg-emerald-500 text-xs font-medium text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          Add monitor
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-zinc-100">
            New monitor
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            We'll check your URL every 60 seconds and alert you instantly on
            failure.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-400">Name</Label>
            <Input
              placeholder="My API"
              className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-400">URL</Label>
            <Input
              placeholder="https://api.example.com/health"
              className="h-9 border-zinc-700 bg-zinc-800 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-400">
                Check every
              </Label>
              <Select defaultValue="300">
                <SelectTrigger className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-300 focus:ring-emerald-500/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-800">
                  {
                    pingIntervals.map((interval)=> (
                      <SelectItem key={interval} value={interval} className="text-sm text-zinc-300">
                        {
                          interval === "30"?"30 seconds":interval === "60" ? "60 seconds" : interval === "300" ? "5 minutes" : "10 minutes"
                        }
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-400">Method</Label>
              <Select defaultValue="GET">
                <SelectTrigger className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-300 focus:ring-emerald-500/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-800">
                  <SelectItem value="GET" className="text-sm text-zinc-300">GET</SelectItem>
                  <SelectItem value="HEAD" className="text-sm text-zinc-300">HEAD</SelectItem>
                  <SelectItem value="POST" className="text-sm text-zinc-300">POST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-emerald-500 text-white hover:bg-emerald-400"
          >
            Create monitor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function MonitorsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [monitors,setMonitors] = useState<Monitor[]>([]);
  const db = createClient();

  
  useEffect(() =>{
    async function load(){
      const data = await getActiveMonitors(db);
      setMonitors(data);
      console.log(data);
    }
    load();
  },[])

  if(monitors === null) return;

  const filtered = monitors.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.url?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || m.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">{stat.label}</p>
              <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
            </div>
            <p className={cn("mt-1.5 text-2xl font-semibold tracking-tight", stat.color)}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
            <Input
              placeholder="Search monitors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-64 border-zinc-800 bg-zinc-900 pl-8 text-sm text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
            />
          </div>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
            {(["all", "up", "down", "paused"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                  filter === f
                    ? "bg-zinc-800 text-zinc-200"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
          <AddMonitorDialog />
        </div>
      </div>

      {/* Monitor table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30">
        

        {/* Rows */}
        <div className="divide-y divide-zinc-800/60">
          {filtered.map((monitor) => (
            <div
              key={monitor.id}
              className="group grid grid-cols-[2fr,1fr,1fr,1fr,auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-zinc-800/20"
            >
              {/* Name + URL */}
              <div className="min-w-0">
                <Link
                  href={`/dashboard/monitors/${monitor.id}`}
                  className="block"
                >
                  <div className="flex items-center gap-2.5">
                    <StatusDot status={monitor.status} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {monitor.name}
                      </p>
                      <p className="truncate text-xs text-zinc-600 font-mono">
                        {monitor.url}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Status badge */}
              <div>
                {monitor.status === "up" && (
                  <Badge className="border-0 bg-emerald-500/10 text-[11px] font-medium text-emerald-400">
                    Operational
                  </Badge>
                )}
                {monitor.status === "down" && (
                  <Badge className="border-0 bg-red-500/10 text-[11px] font-medium text-red-400">
                    Down
                  </Badge>
                )}
                {monitor.status === "paused" && (
                  <Badge className="border-0 bg-zinc-500/10 text-[11px] font-medium text-zinc-500">
                    Paused
                  </Badge>
                )}
              </div>

              {/* Uptime */}
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    monitor.avg_uptime > 99.5
                      ? "text-emerald-400"
                      : monitor.avg_uptime > 95
                      ? "text-amber-400"
                      : "text-red-400"
                  )}
                >
                  {monitor.avg_uptime.toFixed(2)}%
                </p>
                <p className="text-[10px] text-zinc-600">last 30 days</p>
              </div>

              {/* Latency */}
              <div>
                {monitor.avg_latency_ms ? (
                  <>
                    <p className="text-sm font-semibold tabular-nums text-zinc-300">
                      {monitor.avg_latency_ms}ms
                    </p>
                    <p className="text-[10px] text-zinc-600">
                      {monitor.last_checked_at}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-zinc-600">—</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 border-zinc-800 bg-zinc-900"
                  >
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                      <Pencil className="h-3 w-3" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                      <ExternalLink className="h-3 w-3" /> Visit URL
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                      <Pause className="h-3 w-3" /> Pause
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs text-red-400 hover:bg-zinc-800 hover:text-red-300 focus:bg-zinc-800 focus:text-red-300">
                      <Trash2 className="h-3 w-3" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="mb-3 h-8 w-8 text-zinc-700" />
            <p className="text-sm font-medium text-zinc-500">No monitors found</p>
            <p className="mt-1 text-xs text-zinc-600">
              {search ? "Try a different search term" : "Add your first monitor to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-zinc-700">
        Using 3 of 3 monitors on the free plan.{" "}
        <span className="cursor-pointer text-emerald-600 hover:text-emerald-500 transition-colors">
          Upgrade for unlimited monitors →
        </span>
      </p>
    </div>
  )
}