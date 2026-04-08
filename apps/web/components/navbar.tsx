// components/navbar.tsx

"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="flex items-center h-14 px-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20">
        {/* LOGO */}
        <Link href="/" className="font-semibold text-lg tracking-tight">
          <span className="text-purple-400">Ping</span>Shield
        </Link>

        {/* NAV */}
        <div className="ml-10 hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl">
                    <NavItem title="Uptime Monitoring" desc="Track your services in real time" />
                    <NavItem title="Alerts" desc="Get notified instantly" />
                    <NavItem title="Analytics" desc="Detailed uptime insights" />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="#" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">
                  Pricing
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="#" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">
                  Docs
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">
            Login
          </Link>

          <button className="bg-purple-500 hover:bg-purple-400 text-black px-4 py-2 rounded-md text-sm font-medium shadow-lg shadow-purple-500/20 transition">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

function NavItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-3 rounded-lg hover:bg-white/10 transition cursor-pointer">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
  );
}
