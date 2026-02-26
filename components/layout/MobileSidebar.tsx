"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, LayoutDashboard, HardHat, CalendarCheck, Wallet, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useSidebar } from "@/hooks/useSidebar";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
    LayoutDashboard,
    HardHat,
    CalendarCheck,
    Wallet,
    BarChart3,
    Settings,
};

/** Mobile sidebar drawer overlay */
export function MobileSidebar() {
    const isMobileOpen = useSidebar((s) => s.isMobileOpen);
    const closeMobile = useSidebar((s) => s.closeMobile);
    const pathname = usePathname();

    return (
        <AnimatePresence>
            {isMobileOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                        onClick={closeMobile}
                    />
                    {/* Panel */}
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 z-50 w-72 h-full bg-slate-900 text-slate-400 lg:hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <h1 className="text-sm font-semibold text-white">ContractorMS</h1>
                            </div>
                            <Button variant="ghost" size="icon" onClick={closeMobile} className="text-slate-400 hover:text-white" aria-label="Close sidebar">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Navigation */}
                        <nav className="px-3 py-4 space-y-1" aria-label="Mobile navigation">
                            {NAV_ITEMS.map((item) => {
                                const Icon = iconMap[item.icon] || LayoutDashboard;
                                const isActive = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href} onClick={closeMobile}>
                                        <div
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-blue-600/10 text-blue-500"
                                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
