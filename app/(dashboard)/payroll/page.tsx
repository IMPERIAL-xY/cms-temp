"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, subMonths } from "date-fns";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useWorkerStore } from "@/store/workerStore";
import { usePayrollStore } from "@/store/payrollStore";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";
import { Plus, FileText, Loader2, Share2 } from "lucide-react";

const advanceSchema = z.object({
    amount: z.number().min(100, "Minimum ₹100"),
    date: z.string().min(1, "Date is required"),
    note: z.string().max(200).optional(),
});

type AdvanceFormData = z.infer<typeof advanceSchema>;

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/** Payroll management page with summary, advances, and pay slip */
export default function PayrollPage() {
    const workers = useWorkerStore((s) => s.workers);
    const { advances, addAdvance, getPayrollSummary } = usePayrollStore();
    const symbol = useSettingsStore((s) => s.settings.currencySymbol);

    const [selectedWorkerId, setSelectedWorkerId] = useState(workers[0]?.id || "");
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(format(now, "yyyy-MM"));
    const [advanceOpen, setAdvanceOpen] = useState(false);
    const [paySlipOpen, setPaySlipOpen] = useState(false);

    const selectedWorker = workers.find((w) => w.id === selectedWorkerId);
    const summary = getPayrollSummary(selectedWorkerId, selectedMonth);
    const workerAdvances = advances.filter(
        (a) => a.workerId === selectedWorkerId && a.date.startsWith(selectedMonth)
    );

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AdvanceFormData>({
        resolver: zodResolver(advanceSchema),
        defaultValues: { amount: 500, date: format(now, "yyyy-MM-dd"), note: "" },
    });

    const onAdvanceSubmit = async (data: AdvanceFormData) => {
        await addAdvance(selectedWorkerId, data.amount, data.date, data.note || "");
        toast.success("Advance added successfully!");
        reset();
        setAdvanceOpen(false);
    };

    const monthOptions = [0, 1, 2].map((offset) => {
        const d = subMonths(now, offset);
        return { value: format(d, "yyyy-MM"), label: format(d, "MMMM yyyy") };
    });

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate">
            <PageHeader title="Payroll" description="Manage payroll and salary advances">
                <Button onClick={() => setAdvanceOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Advance
                </Button>
                <Button variant="outline" onClick={() => setPaySlipOpen(true)}>
                    <FileText className="mr-2 h-4 w-4" /> Pay Slip
                </Button>
            </PageHeader>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                    <SelectTrigger className="w-full sm:w-56" aria-label="Select worker"><SelectValue placeholder="Select Worker" /></SelectTrigger>
                    <SelectContent>
                        {workers.map((w) => (<SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>))}
                    </SelectContent>
                </Select>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-full sm:w-48" aria-label="Select month"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {monthOptions.map((m) => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>

            {/* Payroll Summary Card */}
            <Card className="mt-6">
                <CardHeader><CardTitle className="text-base">Payroll Summary</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3 font-mono text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Worker</span><span className="font-semibold">{selectedWorker?.name || "-"}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Month</span><span>{monthOptions.find((m) => m.value === selectedMonth)?.label}</span></div>
                        <Separator />
                        <div className="flex justify-between"><span className="text-muted-foreground">Total Days Worked</span><span>{summary.totalDaysWorked}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Daily Wage</span><span>{symbol}{selectedWorker?.dailyWage.toLocaleString("en-IN") || 0}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Total Earnings</span><span>{symbol}{summary.totalEarnings.toLocaleString("en-IN")}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Total Advance Taken</span><span className="text-red-600">-{symbol}{summary.totalAdvance.toLocaleString("en-IN")}</span></div>
                        <Separator />
                        <div className="flex justify-between text-base"><span className="font-semibold">Final Payable</span><span className="font-bold text-blue-600">{symbol}{summary.finalPayable.toLocaleString("en-IN")}</span></div>
                    </div>
                </CardContent>
            </Card>

            {/* Advances Table */}
            <Card className="mt-6">
                <CardHeader><CardTitle className="text-base">Advance Payments</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workerAdvances.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No advances for this period</TableCell></TableRow>
                            ) : (
                                workerAdvances.map((adv) => (
                                    <TableRow key={adv.id}>
                                        <TableCell>{adv.date}</TableCell>
                                        <TableCell>{symbol}{adv.amount.toLocaleString("en-IN")}</TableCell>
                                        <TableCell className="text-muted-foreground">{adv.note || "-"}</TableCell>
                                        <TableCell>
                                            <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", adv.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700")}>
                                                {adv.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Advance Modal */}
            <Dialog open={advanceOpen} onOpenChange={setAdvanceOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Advance Payment</DialogTitle>
                        <DialogDescription>Record a salary advance for {selectedWorker?.name}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onAdvanceSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="adv-amount">Amount ({symbol})</Label>
                            <Input id="adv-amount" type="number" {...register("amount", { valueAsNumber: true })} aria-invalid={!!errors.amount} />
                            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adv-date">Date</Label>
                            <Input id="adv-date" type="date" {...register("date")} aria-invalid={!!errors.date} />
                            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adv-note">Note (optional)</Label>
                            <Textarea id="adv-note" {...register("note")} placeholder="Reason for advance..." />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAdvanceOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : "Add Advance"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Pay Slip Modal */}
            <Dialog open={paySlipOpen} onOpenChange={setPaySlipOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Pay Slip</DialogTitle>
                        <DialogDescription>Generated pay slip for {selectedWorker?.name}</DialogDescription>
                    </DialogHeader>
                    <div className="border rounded-lg p-6 space-y-3 font-mono text-sm bg-slate-50">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-bold">PAY SLIP</h3>
                            <p className="text-xs text-muted-foreground">{monthOptions.find((m) => m.value === selectedMonth)?.label}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between"><span>Employee:</span><span className="font-semibold">{selectedWorker?.name}</span></div>
                        <div className="flex justify-between"><span>Work Type:</span><span>{selectedWorker?.workType}</span></div>
                        <div className="flex justify-between"><span>Days Worked:</span><span>{summary.totalDaysWorked}</span></div>
                        <div className="flex justify-between"><span>Hours Worked:</span><span>{summary.totalHoursWorked}</span></div>
                        <Separator />
                        <div className="flex justify-between"><span>Gross Earnings:</span><span>{symbol}{summary.totalEarnings.toLocaleString("en-IN")}</span></div>
                        <div className="flex justify-between text-red-600"><span>Advances:</span><span>-{symbol}{summary.totalAdvance.toLocaleString("en-IN")}</span></div>
                        <Separator />
                        <div className="flex justify-between text-base font-bold"><span>Net Payable:</span><span className="text-blue-600">{symbol}{summary.finalPayable.toLocaleString("en-IN")}</span></div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                                const monthLabel = monthOptions.find((m) => m.value === selectedMonth)?.label || selectedMonth;
                                const msg = [
                                    `📋 *PAY SLIP — ${monthLabel}*`,
                                    ``,
                                    `👷 Employee: ${selectedWorker?.name}`,
                                    `🔧 Work Type: ${selectedWorker?.workType}`,
                                    `📅 Days Worked: ${summary.totalDaysWorked}`,
                                    `⏱ Hours Worked: ${summary.totalHoursWorked}`,
                                    ``,
                                    `💰 Gross Earnings: ${symbol}${summary.totalEarnings.toLocaleString("en-IN")}`,
                                    `🔻 Advances: -${symbol}${summary.totalAdvance.toLocaleString("en-IN")}`,
                                    ``,
                                    `✅ *Net Payable: ${symbol}${summary.finalPayable.toLocaleString("en-IN")}*`,
                                ].join("\n");
                                const phone = selectedWorker?.phone ? `91${selectedWorker.phone}` : "";
                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
                            }}
                        >
                            <Share2 className="mr-2 h-4 w-4" /> Share via WhatsApp
                        </Button>
                        <Button variant="outline" onClick={() => setPaySlipOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
