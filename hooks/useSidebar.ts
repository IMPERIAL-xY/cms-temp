import { create } from "zustand";

interface SidebarState {
    isOpen: boolean;
    isMobileOpen: boolean;
    toggle: () => void;
    toggleMobile: () => void;
    closeMobile: () => void;
}

/** Hook for managing sidebar state */
export const useSidebar = create<SidebarState>((set) => ({
    isOpen: true,
    isMobileOpen: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
    closeMobile: () => set({ isMobileOpen: false }),
}));
