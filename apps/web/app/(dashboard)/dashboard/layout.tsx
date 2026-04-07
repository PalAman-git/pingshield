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
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Monitors",
    href: "/dashboard/monitors",
    icon: Activity,
  },
  {
    label: "Status Pages",
    href: "/dashboard/status-pages",
    icon: Globe,
  },
  {
    label: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
    badge: "3",
  },
]

const bottomNavItems = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: (typeof navItems)[0]
  collapsed: boolean
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-emerald-400" />
      )}
      <item.icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <Badge
              variant="secondary"
              className="h-5 min-w-5 bg-emerald-500/15 px-1.5 text-[10px] font-semibold text-emerald-400 border-0"
            >
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  )
}

function Sidebar({
  collapsed,
  onToggle,
  mobile,
  onClose,
}: {
  collapsed: boolean
  onToggle: () => void
  mobile?: boolean
  onClose?: () => void
}) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-14 items-center border-b border-zinc-800 px-3",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              PingShield
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 shadow-lg shadow-emerald-500/20">
            <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </div>
        )}
        {!mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "h-7 w-7 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300",
              collapsed && "ml-0"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <Menu className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
        {mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              Main
            </p>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              onClick={onClose}
            />
          ))}
        </div>
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-zinc-800 px-2 py-3">
        <div className="space-y-0.5">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              onClick={onClose}
            />
          ))}
        </div>
      </div>

      {/* User section */}
      {!collapsed && (
        <div className="border-t border-zinc-800 px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-zinc-800/60">
                <Avatar className="h-7 w-7 border border-zinc-700">
                  <AvatarFallback className="bg-zinc-800 text-[10px] font-semibold text-zinc-300">
                    PS
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-zinc-300">
                    Your Account
                  </p>
                  <p className="truncate text-[10px] text-zinc-600">Free plan</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-48 border-zinc-800 bg-zinc-900"
            >
              <DropdownMenuLabel className="text-xs text-zinc-400">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="cursor-pointer text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                <User className="mr-2 h-3.5 w-3.5" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                <Settings className="mr-2 h-3.5 w-3.5" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="cursor-pointer text-xs text-red-400 hover:bg-zinc-800 hover:text-red-300 focus:bg-zinc-800 focus:text-red-300">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </aside>
  )
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()

  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean)
    return segments.map((seg, i) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href: "/" + segments.slice(0, i + 1).join("/"),
      isLast: i === segments.length - 1,
    }))
  }

  const breadcrumbs = getBreadcrumb()

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-8 w-8 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-zinc-700" />
              )}
              {crumb.isLast ? (
                <span className="text-sm font-medium text-zinc-200">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* System status indicator */}
        <div className="hidden items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 sm:flex">
          <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
          <span className="text-[11px] font-medium text-zinc-400">
            All systems operational
          </span>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </Button>
      </div>
    </header>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 font-sans antialiased">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar
              collapsed={false}
              onToggle={() => { }}
              mobile
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}