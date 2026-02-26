"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { WORK_TYPES } from "@/lib/constants";

interface WorkerFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    workTypeFilter: string;
    onWorkTypeChange: (value: string) => void;
}

/** Filter bar for workers table: search + work type filter */
export function WorkerFilters({ search, onSearchChange, workTypeFilter, onWorkTypeChange }: WorkerFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search workers..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                    aria-label="Search workers"
                />
            </div>
            <Select value={workTypeFilter} onValueChange={onWorkTypeChange}>
                <SelectTrigger className="w-full sm:w-48" aria-label="Filter by work type">
                    <SelectValue placeholder="All Work Types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Work Types</SelectItem>
                    {WORK_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
