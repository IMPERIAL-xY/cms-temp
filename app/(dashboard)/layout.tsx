"use client";

import React, { useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { useWorkerStore } from "@/store/workerStore";
import { useAttendanceStore } from "@/store/attendanceStore";
import { usePayrollStore } from "@/store/payrollStore";
import { useSettingsStore } from "@/store/settingsStore";

/** Dashboard layout with sidebar navigation, top bar, and Supabase data fetching */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const hasFetched = useRef(false);
    const loading = useWorkerStore((s) => s.loading);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        // Fetch all data in parallel for maximum speed
        Promise.all([
            useWorkerStore.getState().fetchWorkers(),
            useAttendanceStore.getState().fetchAttendance(),
            usePayrollStore.getState().fetchAdvances(),
            useSettingsStore.getState().fetchSettings(),
        ]);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <MobileSidebar />
            <div className="lg:pl-64">
                <Topbar />
                <main className="p-4 sm:p-6 lg:p-8">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-8 w-48 bg-slate-200 rounded" />
                            <div className="h-4 w-72 bg-slate-100 rounded" />
                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-28 bg-slate-100 rounded-xl" />
                                ))}
                            </div>
                            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                                <div className="h-64 bg-slate-100 rounded-xl" />
                                <div className="h-64 bg-slate-100 rounded-xl" />
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>
        </div>
    );
}
