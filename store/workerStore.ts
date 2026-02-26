import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Worker, WorkerStatus } from "@/types";
import { getInitials } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { mapWorkerRow, toWorkerRow } from "@/lib/supabase/mappers";

interface WorkerState {
    workers: Worker[];
    loading: boolean;
    /** Fetch all workers from Supabase for the current user */
    fetchWorkers: () => Promise<void>;
    /** Add a new worker */
    addWorker: (worker: Omit<Worker, "id" | "avatarInitials" | "joinedAt" | "status">) => Promise<void>;
    /** Update an existing worker */
    updateWorker: (id: string, data: Partial<Worker>) => Promise<void>;
    /** Delete a worker by ID */
    deleteWorker: (id: string) => Promise<void>;
    /** Set worker active/inactive status */
    setWorkerStatus: (id: string, status: WorkerStatus) => Promise<void>;
}

/** Zustand store for managing construction workers via Supabase */
export const useWorkerStore = create<WorkerState>()(
    immer((set) => ({
        workers: [],
        loading: false,

        fetchWorkers: async () => {
            set((state) => { state.loading = true; });
            const supabase = createClient();
            const { data, error } = await supabase
                .from("workers")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) {
                set((state) => {
                    state.workers = data.map(mapWorkerRow);
                    state.loading = false;
                });
            } else {
                set((state) => { state.loading = false; });
            }
        },

        addWorker: async (workerData) => {
            const supabase = createClient();
            // Use getSession() — local JWT, no network call
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;

            const row = toWorkerRow({
                ...workerData,
                status: "Active" as const,
                joinedAt: new Date().toISOString().split("T")[0],
                avatarInitials: getInitials(workerData.name),
                user_id: session.user.id,
            });

            const { data, error } = await supabase
                .from("workers")
                .insert(row)
                .select()
                .single();

            if (!error && data) {
                set((state) => {
                    state.workers.unshift(mapWorkerRow(data));
                });
            }
        },

        updateWorker: async (id, updateData) => {
            const supabase = createClient();
            const row = toWorkerRow(updateData);

            if (updateData.name) {
                row.avatar_initials = getInitials(updateData.name);
            }

            const { data, error } = await supabase
                .from("workers")
                .update(row)
                .eq("id", id)
                .select()
                .single();

            if (!error && data) {
                set((state) => {
                    const index = state.workers.findIndex((w) => w.id === id);
                    if (index !== -1) {
                        state.workers[index] = mapWorkerRow(data);
                    }
                });
            }
        },

        deleteWorker: async (id) => {
            // Optimistic delete — remove from UI immediately
            set((state) => {
                state.workers = state.workers.filter((w) => w.id !== id);
            });

            const supabase = createClient();
            await supabase.from("workers").delete().eq("id", id);
        },

        setWorkerStatus: async (id, status) => {
            // Optimistic update
            set((state) => {
                const worker = state.workers.find((w) => w.id === id);
                if (worker) worker.status = status;
            });

            const supabase = createClient();
            supabase.from("workers").update({ status }).eq("id", id).then();
        },
    }))
);
