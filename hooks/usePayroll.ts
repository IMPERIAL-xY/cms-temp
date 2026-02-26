import { usePayrollStore } from "@/store/payrollStore";

/** Hook for accessing payroll store */
export function usePayroll() {
    const advances = usePayrollStore((s) => s.advances);
    const addAdvance = usePayrollStore((s) => s.addAdvance);
    const markAdvanceDeducted = usePayrollStore((s) => s.markAdvanceDeducted);
    const getPayrollSummary = usePayrollStore((s) => s.getPayrollSummary);

    return {
        advances,
        addAdvance,
        markAdvanceDeducted,
        getPayrollSummary,
    };
}
