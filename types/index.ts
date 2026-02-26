/** Worker job type options */
export type WorkType = 'Mason' | 'Carpenter' | 'Electrician' | 'Plumber' | 'Helper' | 'Painter';

/** Worker active/inactive status */
export type WorkerStatus = 'Active' | 'Inactive';

/** Daily attendance status */
export type AttendanceStatus = 'Present' | 'Absent' | 'Half-Day';

/** Advance payment status */
export type AdvanceStatus = 'Pending' | 'Deducted';

/** Supported currency codes */
export type CurrencyCode = 'INR' | 'USD' | 'AED' | 'SAR';

/** Represents a construction worker */
export interface Worker {
    id: string;
    name: string;
    phone: string;
    workType: WorkType;
    dailyWage: number;
    status: WorkerStatus;
    joinedAt: string;
    avatarInitials: string;
}

/** A single day's attendance record for a worker */
export interface AttendanceRecord {
    id: string;
    workerId: string;
    date: string;
    status: AttendanceStatus;
    hoursWorked: number;
    earnedAmount: number;
}

/** An advance payment made to a worker */
export interface AdvancePayment {
    id: string;
    workerId: string;
    amount: number;
    date: string;
    note: string;
    status: AdvanceStatus;
}

/** Monthly payroll summary for a worker */
export interface PayrollSummary {
    workerId: string;
    totalDaysWorked: number;
    totalHoursWorked: number;
    totalEarnings: number;
    totalAdvance: number;
    finalPayable: number;
    month: string;
}

/** Application-wide settings */
export interface AppSettings {
    companyName: string;
    contractorName: string;
    contactNumber: string;
    currency: CurrencyCode;
    currencySymbol: string;
}

/** Navigation item in sidebar */
export interface NavItem {
    title: string;
    href: string;
    icon: string;
}

/** Currency option for settings */
export interface CurrencyOption {
    code: CurrencyCode;
    symbol: string;
    label: string;
}
