"use client";

import React, { useMemo } from "react";
import { format, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useAttendanceStore } from "@/store/attendanceStore";
import { useSettingsStore } from "@/store/settingsStore";

/** 6-month earnings bar chart using real data */
export function EarningsBarChart() {
    const records = useAttendanceStore((s) => s.records);
    const symbol = useSettingsStore((s) => s.settings.currencySymbol);

    const data = useMemo(() => {
        const now = new Date();
        return Array.from({ length: 6 }, (_, i) => {
            const d = subMonths(now, 5 - i);
            const monthStr = format(d, "yyyy-MM");
            const earnings = records
                .filter((r) => r.date.startsWith(monthStr))
                .reduce((sum, r) => sum + r.earnedAmount, 0);
            return { month: format(d, "MMM"), earnings };
        });
    }, [records]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                            formatter={(value) => [`${symbol}${Number(value).toLocaleString("en-IN")}`, "Earnings"]}
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                        />
                        <Bar dataKey="earnings" fill="#2563eb" radius={[4, 4, 0, 0]} name="Earnings" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
