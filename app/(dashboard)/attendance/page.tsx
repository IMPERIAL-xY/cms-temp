"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isAfter, getDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { useWorkerStore } from "@/store/workerStore";
import { useAttendanceStore } from "@/store/attendanceStore";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";
import { ATTENDANCE_COLORS, STATUS_VARIANTS } from "@/lib/constants";
import { AttendanceStatus } from "@/types";
import { ChevronLeft, ChevronRight, CalendarDays, Clock, DollarSign, UserX } from "lucide-react";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Attendance tracking page with calendar and summary */
export default function AttendancePage() {
    const workers = useWorkerStore((s) => s.workers);
    const { records, markAttendance, getMonthlyStats } = useAttendanceStore();
    const symbol = useSettingsStore((s) => s.settings.currencySymbol);

    const [selectedWorkerId, setSelectedWorkerId] = useState(workers[0]?.id || "");
    const [currentDate, setCurrentDate] = useState(new Date());
    const selectedWorker = workers.find((w) => w.id === selectedWorkerId);

    const monthStr = format(currentDate, "yyyy-MM");
    const stats = getMonthlyStats(selectedWorkerId, monthStr);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayOffset = getDay(monthStart);

    const workerRecords = useMemo(() => {
        return records.filter(
            (r) => r.workerId === selectedWorkerId && r.date.startsWith(monthStr)
        );
    }, [records, selectedWorkerId, monthStr]);

    const getStatusForDate = (date: Date): AttendanceStatus | "Future" | null => {
        if (isAfter(date, new Date())) return "Future";
        const dateStr = format(date, "yyyy-MM-dd");
        const record = workerRecords.find((r) => r.date === dateStr);
        return record ? record.status : null;
    };

    const cycleStatus = async (date: Date) => {
        if (isAfter(date, new Date()) || !selectedWorker) return;
        const dateStr = format(date, "yyyy-MM-dd");
        const current = getStatusForDate(date);
        const cycle: Record<string, { status: AttendanceStatus; hours: number }> = {
            Present: { status: "Absent", hours: 0 },
            Absent: { status: "Half-Day", hours: 4 },
            "Half-Day": { status: "Present", hours: 8 },
        };
        const next = current && current !== "Future" ? cycle[current] : { status: "Present" as AttendanceStatus, hours: 8 };
        await markAttendance(selectedWorkerId, dateStr, next.status, next.hours, selectedWorker.dailyWage);
    };

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const historyRecords = [...workerRecords].sort((a, b) => b.date.localeCompare(a.date));

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate">
            <PageHeader title="Attendance" description="Track daily attendance for your workers" />

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {/* Left: Calendar */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                                        <SelectTrigger className="w-48" aria-label="Select worker"><SelectValue placeholder="Select Worker" /></SelectTrigger>
                                        <SelectContent>
                                            {workers.map((w) => (<SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></Button>
                                    <span className="text-sm font-semibold min-w-[140px] text-center">{format(currentDate, "MMMM yyyy")}</span>
                                    <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month"><ChevronRight className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-1">
                                {DAY_LABELS.map((d) => (
                                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                                ))}
                                {Array.from({ length: startDayOffset }).map((_, i) => (<div key={`empty-${i}`} />))}
                                {days.map((day) => {
                                    const status = getStatusForDate(day);
                                    const colorClass = status && status !== "Future"
                                        ? ATTENDANCE_COLORS[status]
                                        : status === "Future"
                                            ? "bg-gray-100"
                                            : "bg-slate-50 hover:bg-slate-100";
                                    return (
                                        <button
                                            key={day.toISOString()}
                                            onClick={() => cycleStatus(day)}
                                            disabled={isAfter(day, new Date())}
                                            className={cn(
                                                "h-10 rounded-lg text-xs font-medium transition-colors flex items-center justify-center",
                                                colorClass,
                                                status && status !== "Future" && "text-white",
                                                !status && "text-foreground",
                                                status === "Future" && "text-gray-400 cursor-not-allowed"
                                            )}
                                            aria-label={`${format(day, "MMM d")} - ${status || "Not marked"}`}
                                        >
                                            {format(day, "d")}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex gap-4 mt-4 text-xs">
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500" /> Present</div>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /> Absent</div>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-500" /> Half-Day</div>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-200" /> Future</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* History Table */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Attendance History</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Day</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Hours</TableHead>
                                        <TableHead>Earned</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {historyRecords.slice(0, 15).map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell>{r.date}</TableCell>
                                            <TableCell className="text-muted-foreground">{format(new Date(r.date), "EEE")}</TableCell>
                                            <TableCell>
                                                <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", STATUS_VARIANTS[r.status])}>
                                                    {r.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>{r.hoursWorked}h</TableCell>
                                            <TableCell>{symbol}{r.earnedAmount.toLocaleString("en-IN")}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Summary */}
                <div>
                    <Card>
                        <CardHeader><CardTitle className="text-base">Monthly Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                                <CalendarDays className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Days Present</p>
                                    <p className="text-lg font-semibold text-green-700">{stats.present}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Hours</p>
                                    <p className="text-lg font-semibold text-blue-700">{stats.totalHours}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50">
                                <DollarSign className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Estimated Earnings</p>
                                    <p className="text-lg font-semibold text-yellow-700">{symbol}{stats.totalEarnings.toLocaleString("en-IN")}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50">
                                <UserX className="h-5 w-5 text-red-600" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Absences</p>
                                    <p className="text-lg font-semibold text-red-700">{stats.absent}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
