"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WORK_TYPES } from "@/lib/constants";
import { WorkType } from "@/types";
import { Loader2 } from "lucide-react";

const workerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    workType: z.enum(["Mason", "Carpenter", "Electrician", "Plumber", "Helper", "Painter"]),
    dailyWage: z.number().min(100, "Min ₹100").max(10000, "Max ₹10,000"),
});

type WorkerFormData = z.infer<typeof workerSchema>;

interface AddWorkerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: WorkerFormData) => void | Promise<void>;
}

/** Modal dialog for adding a new worker */
export function AddWorkerModal({ open, onOpenChange, onSubmit }: AddWorkerModalProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<WorkerFormData>({
        resolver: zodResolver(workerSchema),
        defaultValues: { name: "", phone: "", workType: "Mason", dailyWage: 500 },
    });

    const handleFormSubmit = async (data: WorkerFormData) => {
        await onSubmit(data);
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Worker</DialogTitle>
                    <DialogDescription>Fill in the worker details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="add-name">Full Name</Label>
                        <Input id="add-name" {...register("name")} placeholder="Enter worker name" aria-invalid={!!errors.name} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="add-phone">Phone Number</Label>
                        <Input id="add-phone" {...register("phone")} placeholder="9876543210" aria-invalid={!!errors.phone} />
                        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="add-workType">Work Type</Label>
                        <Select value={watch("workType")} onValueChange={(val) => setValue("workType", val as WorkType)}>
                            <SelectTrigger id="add-workType"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {WORK_TYPES.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="add-wage">Daily Wage (₹)</Label>
                        <Input id="add-wage" type="number" {...register("dailyWage", { valueAsNumber: true })} aria-invalid={!!errors.dailyWage} />
                        {errors.dailyWage && <p className="text-sm text-destructive">{errors.dailyWage.message}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : "Add Worker"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
