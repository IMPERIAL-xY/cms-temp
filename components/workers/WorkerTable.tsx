"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Worker } from "@/types";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";
import { STATUS_VARIANTS } from "@/lib/constants";

interface WorkerTableProps {
    workers: Worker[];
    onEdit: (worker: Worker) => void;
    onDelete: (worker: Worker) => void;
    onView: (worker: Worker) => void;
}

/** Workers data table with avatar, details, and action buttons */
export function WorkerTable({ workers, onEdit, onDelete, onView }: WorkerTableProps) {
    const symbol = useSettingsStore((s) => s.settings.currencySymbol);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Work Type</TableHead>
                    <TableHead>Daily Wage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {workers.map((worker) => (
                    <TableRow key={worker.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                                        {worker.avatarInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{worker.name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{worker.phone}</TableCell>
                        <TableCell>{worker.workType}</TableCell>
                        <TableCell>{symbol}{worker.dailyWage.toLocaleString("en-IN")}</TableCell>
                        <TableCell>
                            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", STATUS_VARIANTS[worker.status])}>
                                {worker.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => onView(worker)} aria-label={`View ${worker.name}`}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onEdit(worker)} aria-label={`Edit ${worker.name}`}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onDelete(worker)} aria-label={`Delete ${worker.name}`}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
