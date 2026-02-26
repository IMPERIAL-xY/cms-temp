import { Worker, AttendanceRecord, AdvancePayment } from "@/types";
import { format, subMonths, eachDayOfInterval, startOfMonth, endOfMonth, isWeekend } from "date-fns";
import { calculateEarnings, generateId } from "./utils";

/** Pre-generated mock workers with realistic Indian names and details */
export const mockWorkers: Worker[] = [
    {
        id: "w1",
        name: "Rajesh Kumar",
        phone: "9876543210",
        workType: "Mason",
        dailyWage: 800,
        status: "Active",
        joinedAt: "2025-03-15",
        avatarInitials: "RK",
    },
    {
        id: "w2",
        name: "Suresh Patel",
        phone: "9865432109",
        workType: "Carpenter",
        dailyWage: 700,
        status: "Active",
        joinedAt: "2025-04-01",
        avatarInitials: "SP",
    },
    {
        id: "w3",
        name: "Mahesh Sharma",
        phone: "9854321098",
        workType: "Electrician",
        dailyWage: 900,
        status: "Active",
        joinedAt: "2025-02-20",
        avatarInitials: "MS",
    },
    {
        id: "w4",
        name: "Dinesh Yadav",
        phone: "9843210987",
        workType: "Plumber",
        dailyWage: 750,
        status: "Active",
        joinedAt: "2025-05-10",
        avatarInitials: "DY",
    },
    {
        id: "w5",
        name: "Anil Verma",
        phone: "9832109876",
        workType: "Helper",
        dailyWage: 400,
        status: "Active",
        joinedAt: "2025-06-01",
        avatarInitials: "AV",
    },
    {
        id: "w6",
        name: "Vikram Singh",
        phone: "9821098765",
        workType: "Painter",
        dailyWage: 650,
        status: "Inactive",
        joinedAt: "2025-01-15",
        avatarInitials: "VS",
    },
    {
        id: "w7",
        name: "Prakash Joshi",
        phone: "9810987654",
        workType: "Mason",
        dailyWage: 850,
        status: "Active",
        joinedAt: "2025-03-25",
        avatarInitials: "PJ",
    },
    {
        id: "w8",
        name: "Ramesh Gupta",
        phone: "9709876543",
        workType: "Carpenter",
        dailyWage: 600,
        status: "Active",
        joinedAt: "2025-07-01",
        avatarInitials: "RG",
    },
];

/**
 * Generate 3 months of attendance records for all workers
 * Simulates realistic attendance patterns
 */
function generateAttendanceRecords(): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    const now = new Date();

    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
        const targetMonth = subMonths(now, monthOffset);
        const start = startOfMonth(targetMonth);
        const end = monthOffset === 0 ? now : endOfMonth(targetMonth);
        const days = eachDayOfInterval({ start, end });

        for (const worker of mockWorkers) {
            for (const day of days) {
                if (isWeekend(day)) continue;

                const rand = Math.random();
                let status: "Present" | "Absent" | "Half-Day";
                let hoursWorked: number;

                if (rand < 0.75) {
                    status = "Present";
                    hoursWorked = 8;
                } else if (rand < 0.88) {
                    status = "Half-Day";
                    hoursWorked = 4;
                } else {
                    status = "Absent";
                    hoursWorked = 0;
                }

                records.push({
                    id: generateId() + records.length,
                    workerId: worker.id,
                    date: format(day, "yyyy-MM-dd"),
                    status,
                    hoursWorked,
                    earnedAmount: calculateEarnings(worker.dailyWage, hoursWorked),
                });
            }
        }
    }

    return records;
}

/**
 * Generate 2-3 advance payments per worker
 */
function generateAdvancePayments(): AdvancePayment[] {
    const advances: AdvancePayment[] = [];
    const notes = [
        "Family medical expense",
        "Festival advance",
        "House rent",
        "Emergency funds",
        "School fees",
        "Personal expense",
    ];

    for (const worker of mockWorkers) {
        const numAdvances = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numAdvances; i++) {
            const monthOffset = Math.floor(Math.random() * 3);
            const day = 1 + Math.floor(Math.random() * 28);
            const month = subMonths(new Date(), monthOffset);
            const date = format(
                new Date(month.getFullYear(), month.getMonth(), day),
                "yyyy-MM-dd"
            );

            advances.push({
                id: generateId() + advances.length,
                workerId: worker.id,
                amount: (1 + Math.floor(Math.random() * 10)) * 500,
                date,
                note: notes[Math.floor(Math.random() * notes.length)],
                status: Math.random() > 0.4 ? "Deducted" : "Pending",
            });
        }
    }

    return advances;
}

/** Pre-generated attendance records (3 months) */
export const mockAttendanceRecords: AttendanceRecord[] = generateAttendanceRecords();

/** Pre-generated advance payments */
export const mockAdvancePayments: AdvancePayment[] = generateAdvancePayments();
