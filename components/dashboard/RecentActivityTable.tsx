"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWorkerStore } from "@/store/workerStore";
import { useAttendanceStore } from "@/store/attendanceStore";
import { usePayrollStore } from "@/store/payrollStore";
import { useSettingsStore } from "@/store/settingsStore";
import { STATUS_VARIANTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ActivityItem {
    workerName: string;
    action: string;
    date: string;
    amount: string;
    status: string;
}

/** Recent activity table showing latest 10 records */
export function RecentActivityTable() {
    const workers = useWorkerStore((s) => s.workers);
    const records = useAttendanceStore((s) => s.records);
    const advances = usePayrollStore((s) => s.advances);
    const symbol = useSettingsStore((s) => s.settings.currencySymbol);

    const activities: ActivityItem[] = [];

    // Add recent attendance records
    const recentRecords = [...records]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 7);

    for (const record of recentRecords) {
        const worker = workers.find((w) => w.id === record.workerId);
        activities.push({
            workerName: worker?.name || "Unknown",
            action: `Marked ${record.status}`,
            date: record.date,
            amount: `${symbol}${record.earnedAmount.toLocaleString("en-IN")}`,
            status: record.status,
        });
    }

    // Add recent advances
    const recentAdvances = [...advances]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3);

    for (const advance of recentAdvances) {
        const worker = workers.find((w) => w.id === advance.workerId);
        activities.push({
            workerName: worker?.name || "Unknown",
            action: "Advance Payment",
            date: advance.date,
            amount: `${symbol}${advance.amount.toLocaleString("en-IN")}`,
            status: advance.status,
        });
    }

    const sorted = activities
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 10);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Worker</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sorted.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="font-medium">{item.workerName}</TableCell>
                                <TableCell>{item.action}</TableCell>
                                <TableCell className="text-muted-foreground">{item.date}</TableCell>
                                <TableCell>{item.amount}</TableCell>
                                <TableCell>
                                    <span
                                        className={cn(
                                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                            STATUS_VARIANTS[item.status] || "bg-gray-100 text-gray-700"
                                        )}
                                    >
                                        {item.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
