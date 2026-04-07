"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Pause,
  Pencil,
  Trash2,
  Bell,
  Globe,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  MoreHorizontal,
  Circle,
  TrendingUp,
  Zap,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Mock monitor data
const monitor = {
  id: "1",
  name: "Main API",
  url: "https://api.acme.io/health",
  status: "up" as const,
  uptime30: 99.98,
  uptime7: 100,
  uptime24h: 100,
  avgLatency: 142,
  minLatency: 98,
  maxLatency: 412,
  lastChecked: "8 seconds ago",
  interval: 60,
  method: "GET",
  timeout: 10000,
  createdAt: "March 1, 2026",
  nextCheck: "52 seconds",
}

// Mock latency data (last 24 hours, one point per 30 min = 48 points)
const latencyData = Array.from({ length: 48 }, (_, i) => ({
  time: i,
  value: 100 + Math.floor(Math.random() * 120) + (Math.random() > 0.95 ? 300 : 0),
  isUp: Math.random() > 0.02,
}))

// Mock incident data
const incidents = [
  {
    id: "1",
    started: "Mar 21, 2026 11:48 PM",
    resolved: "Mar 22, 2026 12:14 AM",
    duration: "26 minutes",
    cause: "timeout",
    status: "resolved" as const,
  },
  {
    id: "2",
    started: "Mar 15, 2026 3:22 AM",
    resolved: "Mar 15, 2026 3:41 AM",
    duration: "19 minutes",
    cause: "http_error",
    status: "resolved" as const,
  },
]

const uptimePeriods = [
  { label: "24h", value: monitor.uptime24h },
  { label: "7d", value: monitor.uptime7 },
  { label: "30d", value: monitor.uptime30 },
]

function StatusDot({ status }: { status: "up" | "down" | "paused" }) {
  if (status === "up")
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </span>
    )
  if (status === "down")
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-50" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-400" />
      </span>
    )
  return <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
}

function LatencyChart({ data }: { data: typeof latencyData }) {
  const max = Math.max(...data.map((d) => d.value))
  const min = Math.min(...data.map((d) => d.value))
  const range = max - min || 1
  const height = 80

  // Build SVG path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = height - ((d.value - min) / range) * height * 0.85 - 4
    return `${x},${y}`
  })
  const pathD = `M ${points.join(" L ")}`
  const areaD = `M 0,${height} L ${points.join(" L ")} L 100,${height} Z`

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="h-20 w-full"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path
          d={pathD}
          fill="none"
          stroke="#10b981"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Down markers */}
        {data.map((d, i) =>
          !d.isUp ? (
            <line
              key={i}
              x1={(i / (data.length - 1)) * 100}
              y1="0"
              x2={(i / (data.length - 1)) * 100}
              y2={height}
              stroke="#f87171"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
          ) : null
        )}
      </svg>
      <div className="mt-1.5 flex justify-between">
        <span className="text-[10px] text-zinc-600">24h ago</span>
        <span className="text-[10px] text-zinc-600">Now</span>
      </div>
    </div>
  )
}

function UptimeTimeline({ data }: { data: typeof latencyData }) {
  return (
    <div className="flex gap-px">
      {data.map((d, i) => (
        <div
          key={i}
          title={`${d.isUp ? "Up" : "Down"} — ${d.value}ms`}
          className={cn(
            "h-6 flex-1 rounded-[1px] transition-opacity hover:opacity-80",
            d.isUp ? "bg-emerald-500/70" : "bg-red-500/80"
          )}
        />
      ))}
    </div>
  )
}

export default function MonitorDetailPage() {
  const params = useParams()
  const [tab, setTab] = useState("overview")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Link href="/dashboard/monitors">
            <Button
              variant="ghost"
              size="icon"
              className="mt-0.5 h-7 w-7 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <StatusDot status={monitor.status} />
              <h1 className="text-lg font-semibold text-zinc-100">
                {monitor.name}
              </h1>
              <Badge className="border-0 bg-emerald-500/10 text-[11px] text-emerald-400">
                Operational
              </Badge>
            </div>
            <a
              href={monitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {monitor.url}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-10 sm:pl-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-zinc-800 bg-transparent text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <RefreshCw className="h-3 w-3" />
            Check now
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-zinc-800 bg-transparent px-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 border-zinc-800 bg-zinc-900"
            >
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800">
                <Pencil className="h-3 w-3" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800">
                <Pause className="h-3 w-3" /> Pause
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs text-zinc-300 hover:bg-zinc-800 focus:bg-zinc-800">
                <Bell className="h-3 w-3" /> Manage alerts
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="cursor-pointer gap-2 text-xs text-red-400 hover:bg-zinc-800 focus:bg-zinc-800">
                <Trash2 className="h-3 w-3" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {uptimePeriods.map((p) => (
          <div
            key={p.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-4"
          >
            <p className="text-xs text-zinc-500">Uptime ({p.label})</p>
            <p
              className={cn(
                "mt-1.5 text-2xl font-semibold tabular-nums tracking-tight",
                p.value > 99.5 ? "text-emerald-400" : "text-amber-400"
              )}
            >
              {p.value.toFixed(2)}%
            </p>
          </div>
        ))}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-4">
          <p className="text-xs text-zinc-500">Avg latency</p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight text-zinc-300">
            {monitor.avgLatency}ms
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-8 border border-zinc-800 bg-zinc-900 p-0.5">
          {["overview", "incidents", "settings"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="h-7 rounded-md px-3 text-xs font-medium text-zinc-500 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-200 data-[state=active]:shadow-none"
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Response time chart */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-zinc-200">
                  Response time
                </h3>
                <p className="text-xs text-zinc-500">Last 24 hours</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-600">
                <span>
                  Min:{" "}
                  <span className="text-zinc-400">{monitor.minLatency}ms</span>
                </span>
                <span>
                  Avg:{" "}
                  <span className="text-zinc-400">{monitor.avgLatency}ms</span>
                </span>
                <span>
                  Max:{" "}
                  <span className="text-zinc-400">{monitor.maxLatency}ms</span>
                </span>
              </div>
            </div>
            <LatencyChart data={latencyData} />
          </div>

          {/* Uptime timeline */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-zinc-200">
                  Uptime history
                </h3>
                <p className="text-xs text-zinc-500">Last 24 hours</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500/70" />
                  Up
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-red-500/80" />
                  Down
                </span>
              </div>
            </div>
            <UptimeTimeline data={latencyData} />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="mb-4 text-sm font-medium text-zinc-200">
                Configuration
              </h3>
              <dl className="space-y-3">
                {[
                  { label: "Check interval", value: `${monitor.interval}s` },
                  { label: "Method", value: monitor.method },
                  { label: "Timeout", value: `${monitor.timeout / 1000}s` },
                  { label: "Created", value: monitor.createdAt },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <dt className="text-xs text-zinc-500">{item.label}</dt>
                    <dd className="text-xs font-mono font-medium text-zinc-300">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="mb-4 text-sm font-medium text-zinc-200">
                Current status
              </h3>
              <dl className="space-y-3">
                {[
                  { label: "Status", value: "Operational", color: "text-emerald-400" },
                  { label: "Last checked", value: monitor.lastChecked },
                  { label: "Next check", value: `in ${monitor.nextCheck}` },
                  { label: "Incidents (30d)", value: "2" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <dt className="text-xs text-zinc-500">{item.label}</dt>
                    <dd className={cn("text-xs font-medium text-zinc-300", item.color)}>
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </TabsContent>

        {/* Incidents tab */}
        <TabsContent value="incidents" className="mt-4">
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="border-b border-zinc-800 px-5 py-3">
              <h3 className="text-sm font-medium text-zinc-200">
                Incident history
              </h3>
              <p className="text-xs text-zinc-500">
                All recorded outages for this monitor
              </p>
            </div>
            <div className="divide-y divide-zinc-800/60">
              {incidents.map((incident) => (
                <div key={incident.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-zinc-200">
                            Service outage
                          </p>
                          <Badge className="border-0 bg-zinc-800 text-[10px] text-zinc-500">
                            {incident.cause}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          Started {incident.started}
                        </p>
                        <p className="text-xs text-zinc-600">
                          Resolved {incident.resolved}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-zinc-300">
                        {incident.duration}
                      </p>
                      <Badge className="border-0 bg-emerald-500/10 text-[10px] text-emerald-500">
                        Resolved
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Settings tab */}
        <TabsContent value="settings" className="mt-4">
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="mb-4 text-sm font-medium text-zinc-200">
                Monitor settings
              </h3>
              <p className="text-sm text-zinc-500">
                Edit URL, check interval, method, and timeout settings for this
                monitor.
              </p>
              <Button
                size="sm"
                className="mt-4 h-8 bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700"
              >
                <Pencil className="mr-1.5 h-3 w-3" /> Edit settings
              </Button>
            </div>

            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-5">
              <h3 className="mb-1 text-sm font-medium text-red-400">
                Danger zone
              </h3>
              <p className="text-xs text-zinc-500">
                Permanently delete this monitor and all its historical data.
                This cannot be undone.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 h-8 border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="mr-1.5 h-3 w-3" /> Delete monitor
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}