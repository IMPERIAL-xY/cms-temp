"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useWorkerStore } from "@/store/workerStore";
import { useAttendanceStore } from "@/store/attendanceStore";
import { usePayrollStore } from "@/store/payrollStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Download } from "lucide-react";
import { toast } from "sonner";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const CHART_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#1e40af", "#1d4ed8", "#7c3aed"];

/** Reports and Analytics page with 4 charts driven by real data */
export default function ReportsPage() {
    const workers = useWorkerStore((s) => s.workers);
    const records = useAttendanceStore((s) => s.records);
    const advances = usePayrollStore((s) => s.advances);
    const symbol = useSettingsStore((s) => s.settings.currencySymbol);
    const [workerFilter, setWorkerFilter] = useState("all");

    // Filter records/advances by selected worker
    const filteredRecords = useMemo(() =>
        workerFilter === "all" ? records : records.filter((r) => r.workerId === workerFilter),
        [records, workerFilter]
    );
    const filteredAdvances = useMemo(() =>
        workerFilter === "all" ? advances : advances.filter((a) => a.workerId === workerFilter),
        [advances, workerFilter]
    );

    // Monthly Attendance — last 6 months from real data
    const attendanceData = useMemo(() => {
        const now = new Date();
        return Array.from({ length: 6 }, (_, i) => {
            const d = subMonths(now, 5 - i);
            const monthStr = format(d, "yyyy-MM");
            const monthRecords = filteredRecords.filter((r) => r.date.startsWith(monthStr));
            return {
                month: format(d, "MMM"),
                present: monthRecords.filter((r) => r.status === "Present").length,
                absent: monthRecords.filter((r) => r.status === "Absent").length,
            };
        });
    }, [filteredRecords]);

    // Monthly Earnings — last 6 months from real data
    const earningsData = useMemo(() => {
        const now = new Date();
        return Array.from({ length: 6 }, (_, i) => {
            const d = subMonths(now, 5 - i);
            const monthStr = format(d, "yyyy-MM");
            const earnings = filteredRecords
                .filter((r) => r.date.startsWith(monthStr))
                .reduce((sum, r) => sum + r.earnedAmount, 0);
            return { month: format(d, "MMM"), earnings };
        });
    }, [filteredRecords]);

    // Advance vs Net Salary — real totals
    const totalEarnings = filteredRecords.reduce((sum, r) => sum + r.earnedAmount, 0);
    const totalAdvances = filteredAdvances.reduce((sum, a) => sum + a.amount, 0);
    const netSalary = totalEarnings - totalAdvances;

    const pieData = [
        { name: "Net Salary", value: Math.max(0, netSalary) },
        { name: "Advances", value: totalAdvances },
    ];

    // Worker Comparison — real earnings per worker
    const comparisonData = useMemo(() =>
        workers.slice(0, 8).map((w) => {
            const workerEarnings = records
                .filter((r) => r.workerId === w.id)
                .reduce((sum, r) => sum + r.earnedAmount, 0);
            return { name: w.name.split(" ")[0], earnings: workerEarnings };
        }),
        [workers, records]
    );

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate">
            <PageHeader title="Reports" description="Analytics and insights for your operations">
                <Button variant="outline" onClick={() => toast.info("PDF export coming soon!")}>
                    <Download className="mr-2 h-4 w-4" /> Export PDF
                </Button>
            </PageHeader>

            {/* Filter Bar */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Select value={workerFilter} onValueChange={setWorkerFilter}>
                    <SelectTrigger className="w-full sm:w-56" aria-label="Filter by worker"><SelectValue placeholder="All Workers" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Workers</SelectItem>
                        {workers.map((w) => (<SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>

            {/* Charts Grid (2×2) */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* 1. Monthly Attendance Chart */}
                <Card>
                    <CardHeader><CardTitle className="text-base">Monthly Attendance</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
                                <Legend />
                                <Line type="monotone" dataKey="present" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name="Present" />
                                <Line type="monotone" dataKey="absent" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} name="Absent" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 2. Earnings Bar Chart */}
                <Card>
                    <CardHeader><CardTitle className="text-base">Monthly Earnings</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={earningsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip formatter={(value) => [`${symbol}${Number(value).toLocaleString("en-IN")}`, "Earnings"]} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
                                <Bar dataKey="earnings" fill="#2563eb" radius={[4, 4, 0, 0]} name="Earnings" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Advance Pie Chart */}
                <Card>
                    <CardHeader><CardTitle className="text-base">Advance vs Net Salary</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={(props) => `${props.name ?? ""} ${((Number(props.percent) || 0) * 100).toFixed(0)}%`}>
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${symbol}${Number(value).toLocaleString("en-IN")}`]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 4. Worker Comparison Chart */}
                <Card>
                    <CardHeader><CardTitle className="text-base">Worker Comparison</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip formatter={(value) => [`${symbol}${Number(value).toLocaleString("en-IN")}`, "Earnings"]} contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
                                <Bar dataKey="earnings" radius={[4, 4, 0, 0]} name="Total Earnings">
                                    {comparisonData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
