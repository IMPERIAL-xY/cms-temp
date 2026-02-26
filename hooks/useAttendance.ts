import { useAttendanceStore } from "@/store/attendanceStore";

/** Hook for accessing attendance store */
export function useAttendance() {
    const records = useAttendanceStore((s) => s.records);
    const markAttendance = useAttendanceStore((s) => s.markAttendance);
    const updateAttendance = useAttendanceStore((s) => s.updateAttendance);
    const getWorkerAttendance = useAttendanceStore((s) => s.getWorkerAttendance);
    const getMonthlyStats = useAttendanceStore((s) => s.getMonthlyStats);

    return {
        records,
        markAttendance,
        updateAttendance,
        getWorkerAttendance,
        getMonthlyStats,
    };
}
