import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { AdvancePayment, PayrollSummary } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { mapAdvanceRow, toAdvanceRow } from "@/lib/supabase/mappers";
import { useAttendanceStore } from "./attendanceStore";

interface PayrollState {
    advances: AdvancePayment[];
    loading: boolean;
    /** Fetch all advance payments for the current user's workers */
    fetchAdvances: () => Promise<void>;
    /** Add a new advance payment for a worker */
    addAdvance: (workerId: string, amount: number, date: string, note: string) => Promise<void>;
    /** Mark an advance as deducted */
    markAdvanceDeducted: (id: string) => Promise<void>;
    /** Compute full payroll summary for a worker in a given month */
    getPayrollSummary: (workerId: string, month: string) => PayrollSummary;
}

/** Zustand store for managing payroll and advance payments via Supabase */
export const usePayrollStore = create<PayrollState>()(
    immer((set, get) => ({
        advances: [],
        loading: false,

        fetchAdvances: async () => {
            set((state) => { state.loading = true; });
            const supabase = createClient();
            const { data, error } = await supabase
                .from("advances")
                .select("*")
                .order("date", { ascending: false });

            if (!error && data) {
                set((state) => {
                    state.advances = data.map(mapAdvanceRow);
                    state.loading = false;
                });
            } else {
                set((state) => { state.loading = false; });
            }
        },

        addAdvance: async (workerId, amount, date, note) => {
            const supabase = createClient();
            const row = toAdvanceRow({
                workerId,
                amount,
                date,
                note,
                status: "Pending",
            });

            const { data, error } = await supabase
                .from("advances")
                .insert(row)
                .select()
                .single();

            if (!error && data) {
                set((state) => {
                    state.advances.unshift(mapAdvanceRow(data));
                });
            }
        },

        markAdvanceDeducted: async (id) => {
            // Optimistic update
            set((state) => {
                const advance = state.advances.find((a) => a.id === id);
                if (advance) advance.status = "Deducted";
            });

            const supabase = createClient();
            supabase.from("advances").update({ status: "Deducted" }).eq("id", id).then();
        },

        getPayrollSummary: (workerId, month) => {
            const attendanceRecords = useAttendanceStore
                .getState()
                .records.filter(
                    (r) => r.workerId === workerId && r.date.startsWith(month)
                );

            const totalDaysWorked = attendanceRecords.filter(
                (r) => r.status === "Present" || r.status === "Half-Day"
            ).length;
            const totalHoursWorked = attendanceRecords.reduce(
                (sum, r) => sum + r.hoursWorked,
                0
            );
            const totalEarnings = attendanceRecords.reduce(
                (sum, r) => sum + r.earnedAmount,
                0
            );

            const workerAdvances = get().advances.filter(
                (a) => a.workerId === workerId && a.date.startsWith(month)
            );
            const totalAdvance = workerAdvances.reduce(
                (sum, a) => sum + a.amount,
                0
            );

            return {
                workerId,
                totalDaysWorked,
                totalHoursWorked,
                totalEarnings,
                totalAdvance,
                finalPayable: totalEarnings - totalAdvance,
                month,
            };
        },
    }))
);
