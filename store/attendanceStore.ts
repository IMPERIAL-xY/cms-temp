import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { AttendanceRecord, AttendanceStatus } from "@/types";
import { calculateEarnings, generateId } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { mapAttendanceRow, toAttendanceRow } from "@/lib/supabase/mappers";

interface AttendanceState {
    records: AttendanceRecord[];
    loading: boolean;
    /** Fetch all attendance records for the current user's workers */
    fetchAttendance: () => Promise<void>;
    /** Mark attendance for a worker on a specific date */
    markAttendance: (
        workerId: string,
        date: string,
        status: AttendanceStatus,
        hoursWorked: number,
        dailyWage: number
    ) => Promise<void>;
    /** Update an existing attendance record */
    updateAttendance: (id: string, data: Partial<AttendanceRecord>) => Promise<void>;
    /** Get all attendance records for a specific worker */
    getWorkerAttendance: (workerId: string) => AttendanceRecord[];
    /** Get monthly attendance stats for a worker */
    getMonthlyStats: (workerId: string, month: string) => {
        present: number;
        absent: number;
        halfDay: number;
        totalHours: number;
        totalEarnings: number;
    };
}

/** Zustand store for managing attendance records via Supabase */
export const useAttendanceStore = create<AttendanceState>()(
    immer((set, get) => ({
        records: [],
        loading: false,

        fetchAttendance: async () => {
            set((state) => { state.loading = true; });
            const supabase = createClient();
            const { data, error } = await supabase
                .from("attendance")
                .select("*")
                .order("date", { ascending: false });

            if (!error && data) {
                set((state) => {
                    state.records = data.map(mapAttendanceRow);
                    state.loading = false;
                });
            } else {
                set((state) => { state.loading = false; });
            }
        },

        markAttendance: async (workerId, date, status, hoursWorked, dailyWage) => {
            const earnedAmount = calculateEarnings(dailyWage, hoursWorked);

            // Optimistic update — update UI instantly
            const tempId = generateId();
            set((state) => {
                const existing = state.records.findIndex(
                    (r) => r.workerId === workerId && r.date === date
                );
                const optimistic: AttendanceRecord = {
                    id: existing !== -1 ? state.records[existing].id : tempId,
                    workerId,
                    date,
                    status,
                    hoursWorked,
                    earnedAmount,
                };
                if (existing !== -1) {
                    state.records[existing] = optimistic;
                } else {
                    state.records.unshift(optimistic);
                }
            });

            // Persist to Supabase in background
            const supabase = createClient();
            const row = toAttendanceRow({
                workerId,
                date,
                status,
                hoursWorked,
                earnedAmount,
            });
            supabase
                .from("attendance")
                .upsert(row, { onConflict: "worker_id,date" })
                .select()
                .single()
                .then(({ data }) => {
                    if (data) {
                        // Replace temp record with real DB record (gets real ID)
                        set((state) => {
                            const idx = state.records.findIndex(
                                (r) => r.workerId === workerId && r.date === date
                            );
                            if (idx !== -1) {
                                state.records[idx] = mapAttendanceRow(data);
                            }
                        });
                    }
                });
        },

        updateAttendance: async (id, updateData) => {
            const supabase = createClient();
            const row = toAttendanceRow(updateData);

            const { data, error } = await supabase
                .from("attendance")
                .update(row)
                .eq("id", id)
                .select()
                .single();

            if (!error && data) {
                set((state) => {
                    const index = state.records.findIndex((r) => r.id === id);
                    if (index !== -1) {
                        state.records[index] = mapAttendanceRow(data);
                    }
                });
            }
        },

        getWorkerAttendance: (workerId) => {
            return get().records.filter((r) => r.workerId === workerId);
        },

        getMonthlyStats: (workerId, month) => {
            const records = get().records.filter(
                (r) => r.workerId === workerId && r.date.startsWith(month)
            );
            return {
                present: records.filter((r) => r.status === "Present").length,
                absent: records.filter((r) => r.status === "Absent").length,
                halfDay: records.filter((r) => r.status === "Half-Day").length,
                totalHours: records.reduce((sum, r) => sum + r.hoursWorked, 0),
                totalEarnings: records.reduce((sum, r) => sum + r.earnedAmount, 0),
            };
        },
    }))
);
