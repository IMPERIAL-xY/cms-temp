import { Worker, AttendanceRecord, AdvancePayment, AppSettings } from "@/types";

// ============================================================
// Supabase row ↔ App type mappers
// Supabase uses snake_case, our app uses camelCase
// ============================================================

/** Map a Supabase workers row to our Worker type */
export function mapWorkerRow(row: Record<string, unknown>): Worker {
    return {
        id: row.id as string,
        name: row.name as string,
        phone: row.phone as string,
        workType: row.work_type as Worker["workType"],
        dailyWage: Number(row.daily_wage),
        status: row.status as Worker["status"],
        joinedAt: row.joined_at as string,
        avatarInitials: row.avatar_initials as string,
    };
}

/** Map our Worker type to a Supabase insert/update object */
export function toWorkerRow(worker: Partial<Worker> & { user_id?: string }) {
    const row: Record<string, unknown> = {};
    if (worker.user_id !== undefined) row.user_id = worker.user_id;
    if (worker.name !== undefined) row.name = worker.name;
    if (worker.phone !== undefined) row.phone = worker.phone;
    if (worker.workType !== undefined) row.work_type = worker.workType;
    if (worker.dailyWage !== undefined) row.daily_wage = worker.dailyWage;
    if (worker.status !== undefined) row.status = worker.status;
    if (worker.joinedAt !== undefined) row.joined_at = worker.joinedAt;
    if (worker.avatarInitials !== undefined) row.avatar_initials = worker.avatarInitials;
    return row;
}

/** Map a Supabase attendance row to our AttendanceRecord type */
export function mapAttendanceRow(row: Record<string, unknown>): AttendanceRecord {
    return {
        id: row.id as string,
        workerId: row.worker_id as string,
        date: row.date as string,
        status: row.status as AttendanceRecord["status"],
        hoursWorked: Number(row.hours_worked),
        earnedAmount: Number(row.earned_amount),
    };
}

/** Map our AttendanceRecord to a Supabase insert/update object */
export function toAttendanceRow(record: Partial<AttendanceRecord>) {
    const row: Record<string, unknown> = {};
    if (record.workerId !== undefined) row.worker_id = record.workerId;
    if (record.date !== undefined) row.date = record.date;
    if (record.status !== undefined) row.status = record.status;
    if (record.hoursWorked !== undefined) row.hours_worked = record.hoursWorked;
    if (record.earnedAmount !== undefined) row.earned_amount = record.earnedAmount;
    return row;
}

/** Map a Supabase advances row to our AdvancePayment type */
export function mapAdvanceRow(row: Record<string, unknown>): AdvancePayment {
    return {
        id: row.id as string,
        workerId: row.worker_id as string,
        amount: Number(row.amount),
        date: row.date as string,
        note: (row.note as string) || "",
        status: row.status as AdvancePayment["status"],
    };
}

/** Map our AdvancePayment to a Supabase insert/update object */
export function toAdvanceRow(advance: Partial<AdvancePayment>) {
    const row: Record<string, unknown> = {};
    if (advance.workerId !== undefined) row.worker_id = advance.workerId;
    if (advance.amount !== undefined) row.amount = advance.amount;
    if (advance.date !== undefined) row.date = advance.date;
    if (advance.note !== undefined) row.note = advance.note;
    if (advance.status !== undefined) row.status = advance.status;
    return row;
}

/** Map a Supabase settings row to our AppSettings type */
export function mapSettingsRow(row: Record<string, unknown>): AppSettings {
    return {
        companyName: (row.company_name as string) || "My Company",
        contractorName: (row.contractor_name as string) || "",
        contactNumber: (row.contact_number as string) || "",
        currency: (row.currency as AppSettings["currency"]) || "INR",
        currencySymbol: (row.currency_symbol as string) || "₹",
    };
}

/** Map our AppSettings to a Supabase insert/update object */
export function toSettingsRow(settings: Partial<AppSettings> & { user_id?: string }) {
    const row: Record<string, unknown> = {};
    if (settings.user_id !== undefined) row.user_id = settings.user_id;
    if (settings.companyName !== undefined) row.company_name = settings.companyName;
    if (settings.contractorName !== undefined) row.contractor_name = settings.contractorName;
    if (settings.contactNumber !== undefined) row.contact_number = settings.contactNumber;
    if (settings.currency !== undefined) row.currency = settings.currency;
    if (settings.currencySymbol !== undefined) row.currency_symbol = settings.currencySymbol;
    return row;
}
