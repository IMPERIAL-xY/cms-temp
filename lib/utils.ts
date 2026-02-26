import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param symbol - Currency symbol (default: ₹)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, symbol: string = "₹"): string {
    return `${symbol}${amount.toLocaleString("en-IN")}`;
}

/**
 * Generate initials from a full name
 * @param name - The full name
 * @returns Two-letter initials
 */
export function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate a unique ID
 * @returns A unique string ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Calculate earned amount based on daily wage and hours worked
 * @param dailyWage - The worker's daily wage
 * @param hoursWorked - Hours worked in the day
 * @returns Earned amount
 */
export function calculateEarnings(dailyWage: number, hoursWorked: number): number {
    return Math.round((dailyWage / 8) * hoursWorked);
}
