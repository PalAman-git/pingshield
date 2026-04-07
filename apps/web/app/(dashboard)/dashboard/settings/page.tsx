"use client"

import { useState } from "react"
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Key,
  ChevronRight,
  Check,
  Zap,
  AlertTriangle,
  Mail,
  Blocks,
  Webhook,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
  { id: "api", label: "API Keys", icon: Key },
]

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-5 py-4">
        <h3 className="text-sm font-medium text-zinc-200">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
        )}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
        plan === "pro"
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-zinc-800 text-zinc-400"
      )}
    >
      {plan === "pro" && <Zap className="h-2.5 w-2.5" />}
      {plan.toUpperCase()}
    </span>
  )
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [showApiKey, setShowApiKey] = useState(false)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [slackAlerts, setSlackAlerts] = useState(false)
  const [recoveryAlerts, setRecoveryAlerts] = useState(true)
  const [digestEmail, setDigestEmail] = useState(false)

  return (
    <div className="flex gap-6">
      {/* Sidebar nav */}
      <div className="hidden w-48 shrink-0 lg:block">
        <nav className="space-y-0.5">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
                activeSection === section.id
                  ? "bg-zinc-800 text-zinc-200"
                  : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
              )}
            >
              <section.icon
                className={cn(
                  "h-3.5 w-3.5",
                  activeSection === section.id ? "text-emerald-400" : "text-zinc-600"
                )}
              />
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile section selector */}
      <div className="mb-4 lg:hidden">
        <Select value={activeSection} onValueChange={setActiveSection}>
          <SelectTrigger className="border-zinc-800 bg-zinc-900 text-zinc-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-zinc-800 bg-zinc-900">
            {settingsSections.map((s) => (
              <SelectItem key={s.id} value={s.id} className="text-zinc-300">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Profile section */}
        {activeSection === "profile" && (
          <>
            <SectionCard
              title="Personal information"
              description="Update your name and email address"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-400">
                      Full name
                    </Label>
                    <Input
                      defaultValue="Rahul Sharma"
                      className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus-visible:ring-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-400">
                      Email
                    </Label>
                    <Input
                      defaultValue="rahul@example.com"
                      className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus-visible:ring-emerald-500/50"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="h-8 bg-emerald-500 text-xs text-white hover:bg-emerald-400"
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Password"
              description="Change your account password"
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-400">
                    Current password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus-visible:ring-emerald-500/50"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-400">
                      New password
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus-visible:ring-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-400">
                      Confirm password
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-9 border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus-visible:ring-emerald-500/50"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="h-8 bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700"
                  >
                    Update password
                  </Button>
                </div>
              </div>
            </SectionCard>
          </>
        )}

        {/* Notifications section */}
        {activeSection === "notifications" && (
          <>
            <SectionCard
              title="Alert channels"
              description="Configure where to receive alerts when a monitor goes down"
            >
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800">
                      <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-300">Email</p>
                      <p className="text-xs text-zinc-500">rahul@example.com</p>
                    </div>
                  </div>
                  <Switch
                    checked={emailAlerts}
                    onCheckedChange={setEmailAlerts}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>

                {/* Slack */}
                <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800">
                      <Blocks className="h-3.5 w-3.5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-300">Slack</p>
                      <p className="text-xs text-zinc-500">Not configured</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 border-zinc-700 bg-transparent text-[11px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    >
                      Connect
                    </Button>
                    <Switch
                      checked={slackAlerts}
                      onCheckedChange={setSlackAlerts}
                      disabled
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                </div>

                {/* Webhook */}
                <div className="rounded-lg border border-dashed border-zinc-800 px-4 py-3">
                  <button className="flex w-full items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                    <Plus className="h-3 w-3" /> Add webhook endpoint
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Alert preferences"
              description="Control which events trigger notifications"
            >
              <div className="space-y-4">
                {[
                  {
                    label: "Downtime alerts",
                    desc: "Get notified immediately when a monitor goes down",
                    value: emailAlerts,
                    onChange: setEmailAlerts,
                  },
                  {
                    label: "Recovery alerts",
                    desc: "Get notified when a monitor comes back up",
                    value: recoveryAlerts,
                    onChange: setRecoveryAlerts,
                  },
                  {
                    label: "Weekly digest",
                    desc: "Weekly summary of uptime and incidents",
                    value: digestEmail,
                    onChange: setDigestEmail,
                  },
                ].map((pref) => (
                  <div
                    key={pref.label}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-300">
                        {pref.label}
                      </p>
                      <p className="text-xs text-zinc-500">{pref.desc}</p>
                    </div>
                    <Switch
                      checked={pref.value}
                      onCheckedChange={pref.onChange}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          </>
        )}

        {/* Billing section */}
        {activeSection === "billing" && (
          <>
            <SectionCard title="Current plan">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-200">
                      Free plan
                    </p>
                    <PlanBadge plan="free" />
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    3 monitors · Email alerts · 60s check interval
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 bg-emerald-500 text-xs text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="h-3 w-3" /> Upgrade to Pro
                </Button>
              </div>

              <Separator className="my-4 bg-zinc-800" />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Monitors used", value: "3 / 3" },
                  { label: "Status pages", value: "1 / 1" },
                  { label: "Alert channels", value: "1 / 1" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-zinc-500">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-200">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Pro plan"
              description="Everything you need for a serious product"
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "10 monitors",
                  "60s check interval",
                  "Email + Slack alerts",
                  "Custom domains",
                  "90-day history",
                  "Priority support",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span className="text-xs text-zinc-400">{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                className="mt-5 h-9 w-full gap-1.5 bg-emerald-500 text-sm font-medium text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
              >
                <Zap className="h-3.5 w-3.5" /> Upgrade for $9/month
              </Button>
            </SectionCard>
          </>
        )}

        {/* Security section */}
        {activeSection === "security" && (
          <SectionCard
            title="Security"
            description="Manage your account security settings"
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    Two-factor authentication
                  </p>
                  <p className="text-xs text-zinc-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 border-zinc-700 bg-transparent text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                >
                  Enable 2FA
                </Button>
              </div>
              <Separator className="bg-zinc-800" />
              <div className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">
                      Account not fully secured
                    </p>
                    <p className="mt-0.5 text-xs text-amber-600">
                      Enable two-factor authentication to protect your account
                      and monitoring data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* API Keys section */}
        {activeSection === "api" && (
          <>
            <SectionCard
              title="API keys"
              description="Use these keys to access the PingShield API"
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-400">
                      Secret key
                    </Label>
                    <Badge className="border-0 bg-zinc-800 text-[10px] text-zinc-500">
                      Live
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        readOnly
                        value={
                          showApiKey
                            ? "ps_live_abc123xyz456def789ghi012jkl345mno678"
                            : "ps_live_••••••••••••••••••••••••••••••••••••"
                        }
                        className="h-9 border-zinc-700 bg-zinc-800 font-mono text-xs text-zinc-300 focus-visible:ring-emerald-500/50"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="h-9 w-9 shrink-0 border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                    >
                      {showApiKey ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-zinc-600">
                  Keep your API key secret. Never share it or commit it to
                  version control.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-zinc-700 bg-transparent text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  >
                    Copy key
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-red-500/20 bg-transparent text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Danger zone"
              description="Irreversible account actions"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Delete account
                    </p>
                    <p className="text-xs text-zinc-500">
                      Permanently delete your account and all data. Cannot be
                      undone.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 border-red-500/20 bg-transparent text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="mr-1.5 h-3 w-3" /> Delete account
                  </Button>
                </div>
              </div>
            </SectionCard>
          </>
        )}
      </div>
    </div>
  )
}