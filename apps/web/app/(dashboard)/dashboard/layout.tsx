"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Activity,
  LayoutDashboard,
  Settings,
  Bell,
  Globe,
  ChevronRight,
  Menu,
  X,
  Zap,
  Circle,
  LogOut,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Monitors", href: "/dashboard/monitors", icon: Activity },
  { label: "Status Pages", href: "/dashboard/status-pages", icon: Globe },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell, badge: "3" },
]

const bottomNavItems = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

function NavLink({ item, collapsed, onClick }: any) {
  const pathname = usePathname()
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-purple-500/10 to-transparent text-white"
          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-purple-400" />
      )}

      <item.icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"
        )}
      />

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <Badge className="h-5 min-w-5 bg-purple-500/15 px-1.5 text-[10px] font-semibold text-purple-400 border-0">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  )
}

function Sidebar({ collapsed, onToggle, mobile, onClose }: any) {
  return (
    <aside
      className={cn(
        "relative flex h-full flex-col bg-zinc-950/70 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Purple edge glow */}
      <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />

      {/* Logo */}
      <div className={cn("flex h-14 items-center px-3", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">PingShield</span>
          </Link>
        )}

        {!mobile && (
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-7 w-7 text-zinc-500 hover:bg-white/5">
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
          </Button>
        )}

        {mobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-zinc-500 hover:bg-white/5">
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} onClick={onClose} />
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} onClick={onClose} />
        ))}
      </div>

      {/* User */}
      {!collapsed && (
        <div className="px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-white/5">
                <Avatar className="h-7 w-7 border border-white/10">
                  <AvatarFallback className="bg-zinc-800 text-xs text-zinc-300">PS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-xs text-zinc-300">Your Account</p>
                  <p className="text-[10px] text-zinc-500">Free plan</p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 border-white/10 bg-zinc-900">
              <DropdownMenuItem className="text-xs text-zinc-300">
                <User className="mr-2 h-3.5 w-3.5" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs text-zinc-300">
                <Settings className="mr-2 h-3.5 w-3.5" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-red-400">
                <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </aside>
  )
}

function Topbar({ onMenuClick }: any) {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="relative flex h-14 items-center justify-between bg-zinc-950/60 backdrop-blur-xl px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>

        <span className="text-sm text-zinc-300 capitalize">
          {segments[segments.length - 1] || "Dashboard"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400">
          <Circle className="h-2 w-2 text-purple-400 fill-purple-400" />
          All systems operational
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
        </Button>
      </div>

      {/* bottom glow */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </header>
  )
}

export default function DashboardLayout({ children }: any) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(168,85,247,0.10),transparent_60%)] blur-2xl" />

      <div className="relative z-10 flex w-full">
        <div className="hidden md:flex">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
            <Sidebar mobile onClose={() => setMobileOpen(false)} collapsed={false} />
          </div>
        )}

        <div className="flex flex-1 flex-col">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
