"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, CreditCard, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceLineChart } from "@/components/dashboard/AttendanceLineChart";
import { EarningsBarChart } from "@/components/dashboard/EarningsBarChart";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";
import { useWorkerStore } from "@/store/workerStore";
import { useAttendanceStore } from "@/store/attendanceStore";
import { usePayrollStore } from "@/store/payrollStore";
import { useSettingsStore } from "@/store/settingsStore";
import { formatCurrency } from "@/lib/utils";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const containerVariants = {
    animate: { transition: { staggerChildren: 0.1 } },
};

/** Dashboard home page with stats, charts, and recent activity */
export default function DashboardPage() {
    const workers = useWorkerStore((s) => s.workers);
    const records = useAttendanceStore((s) => s.records);
    const advances = usePayrollStore((s) => s.advances);
    const symbol = useSettingsStore((s) => s.settings.currencySymbol);

    const totalEarnings = records.reduce((sum, r) => sum + r.earnedAmount, 0);
    const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);
    const pendingAdvances = advances
        .filter((a) => a.status === "Pending")
        .reduce((sum, a) => sum + a.amount, 0);

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate">
            <PageHeader title="Dashboard" description="Welcome back! Here's an overview of your operations." />

            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
                <StatsCard
                    title="Total Workers"
                    value={String(workers.length)}
                    icon={Users}
                    trend={`${workers.filter((w) => w.status === "Active").length} active`}
                    trendUp
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatsCard
                    title="Total Earnings"
                    value={formatCurrency(totalEarnings, symbol)}
                    icon={DollarSign}
                    trend="Last 3 months"
                    trendUp
                    iconBg="bg-green-50"
                    iconColor="text-green-600"
                />
                <StatsCard
                    title="Total Advances"
                    value={formatCurrency(totalAdvances, symbol)}
                    icon={CreditCard}
                    trend={`${advances.length} transactions`}
                    iconBg="bg-yellow-50"
                    iconColor="text-yellow-600"
                />
                <StatsCard
                    title="Pending Payments"
                    value={formatCurrency(pendingAdvances, symbol)}
                    icon={AlertCircle}
                    trend={`${advances.filter((a) => a.status === "Pending").length} pending`}
                    iconBg="bg-red-50"
                    iconColor="text-red-600"
                />
            </motion.div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <AttendanceLineChart />
                <EarningsBarChart />
            </div>

            <div className="mt-6">
                <RecentActivityTable />
            </div>
        </motion.div>
    );
}
