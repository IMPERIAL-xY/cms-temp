import { WorkType, CurrencyOption, NavItem } from "@/types";

/** Available worker job types */
export const WORK_TYPES: WorkType[] = [
    "Mason",
    "Carpenter",
    "Electrician",
    "Plumber",
    "Helper",
    "Painter",
];

/** Supported currencies with symbols */
export const CURRENCIES: CurrencyOption[] = [
    { code: "INR", symbol: "₹", label: "Indian Rupee (₹)" },
    { code: "USD", symbol: "$", label: "US Dollar ($)" },
    { code: "AED", symbol: "د.إ", label: "UAE Dirham (د.إ)" },
    { code: "SAR", symbol: "﷼", label: "Saudi Riyal (﷼)" },
];

/** Sidebar navigation items */
export const NAV_ITEMS: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "Workers", href: "/workers", icon: "HardHat" },
    { title: "Attendance", href: "/attendance", icon: "CalendarCheck" },
    { title: "Payroll", href: "/payroll", icon: "Wallet" },
    { title: "Reports", href: "/reports", icon: "BarChart3" },
    { title: "Settings", href: "/settings", icon: "Settings" },
];

/** Default number of rows per page in tables */
export const ROWS_PER_PAGE = 10;

/** Attendance status colors for the calendar */
export const ATTENDANCE_COLORS: Record<string, string> = {
    Present: "bg-green-500",
    Absent: "bg-red-500",
    "Half-Day": "bg-yellow-500",
    Future: "bg-gray-200",
};

/** Month names */
export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

/** Status badge variants */
export const STATUS_VARIANTS: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    "Half-Day": "bg-yellow-100 text-yellow-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Deducted: "bg-blue-100 text-blue-700",
};
