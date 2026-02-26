"use client";

import React, { useMemo } from "react";
import { format, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useAttendanceStore } from "@/store/attendanceStore";

/** 6-month attendance trend line chart using real data */
export function AttendanceLineChart() {
    const records = useAttendanceStore((s) => s.records);

    const data = useMemo(() => {
        const now = new Date();
        return Array.from({ length: 6 }, (_, i) => {
            const d = subMonths(now, 5 - i);
            const monthStr = format(d, "yyyy-MM");
            const monthRecords = records.filter((r) => r.date.startsWith(monthStr));
            return {
                month: format(d, "MMM"),
                present: monthRecords.filter((r) => r.status === "Present").length,
                absent: monthRecords.filter((r) => r.status === "Absent").length,
            };
        });
    }, [records]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
                        <Legend />
                        <Line type="monotone" dataKey="present" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="Present" />
                        <Line type="monotone" dataKey="absent" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} name="Absent" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
