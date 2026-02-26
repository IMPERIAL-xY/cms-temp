import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { AppSettings, CurrencyCode } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { mapSettingsRow, toSettingsRow } from "@/lib/supabase/mappers";

interface SettingsState {
    settings: AppSettings;
    loading: boolean;
    /** Fetch settings from Supabase for the current user */
    fetchSettings: () => Promise<void>;
    /** Update application settings (persists to Supabase) */
    updateSettings: (data: Partial<AppSettings>) => Promise<void>;
}

const currencySymbols: Record<CurrencyCode, string> = {
    INR: "₹",
    USD: "$",
    AED: "د.إ",
    SAR: "﷼",
};

const defaultSettings: AppSettings = {
    companyName: "My Company",
    contractorName: "",
    contactNumber: "",
    currency: "INR",
    currencySymbol: "₹",
};

/** Zustand store for application settings via Supabase */
export const useSettingsStore = create<SettingsState>()(
    immer((set) => ({
        settings: defaultSettings,
        loading: false,

        fetchSettings: async () => {
            set((state) => { state.loading = true; });
            const supabase = createClient();
            // Use getSession() — local JWT decode, no network call
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                set((state) => { state.loading = false; });
                return;
            }

            const { data, error } = await supabase
                .from("settings")
                .select("*")
                .eq("user_id", session.user.id)
                .single();

            if (!error && data) {
                set((state) => {
                    state.settings = mapSettingsRow(data);
                    state.loading = false;
                });
            } else {
                // No settings row yet — create one with defaults
                const row = toSettingsRow({ ...defaultSettings, user_id: session.user.id });
                const { data: newData } = await supabase
                    .from("settings")
                    .insert(row)
                    .select()
                    .single();

                if (newData) {
                    set((state) => {
                        state.settings = mapSettingsRow(newData);
                        state.loading = false;
                    });
                } else {
                    set((state) => { state.loading = false; });
                }
            }
        },

        updateSettings: async (data) => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;

            // Apply currency symbol mapping locally
            const updatedData = { ...data };
            if (data.currency) {
                updatedData.currencySymbol = currencySymbols[data.currency];
            }

            // Update local state immediately for responsiveness
            set((state) => {
                Object.assign(state.settings, updatedData);
            });

            // Persist to Supabase (fire and forget for speed)
            const row = toSettingsRow(updatedData);
            supabase
                .from("settings")
                .update(row)
                .eq("user_id", session.user.id)
                .then();
        },
    }))
);
