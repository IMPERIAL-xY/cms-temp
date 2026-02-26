"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    HardHat,
    CalendarCheck,
    Wallet,
    BarChart3,
    Settings,
    Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
    LayoutDashboard,
    HardHat,
    CalendarCheck,
    Wallet,
    BarChart3,
    Settings,
};

/** Main sidebar navigation for the dashboard */
export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 text-slate-400 min-h-screen fixed left-0 top-0 z-40">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600">
                    <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-sm font-semibold text-white">ContractorMS</h1>
                    <p className="text-xs text-slate-500">Management System</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
                {NAV_ITEMS.map((item) => {
                    const Icon = iconMap[item.icon] || LayoutDashboard;
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.15 }}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-500"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.title}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800">
                <p className="text-xs text-slate-600">© 2025 ContractorMS</p>
            </div>
        </aside>
    );
}
