"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WORK_TYPES } from "@/lib/constants";
import { Worker, WorkType } from "@/types";
import { Loader2 } from "lucide-react";

const workerSchema = z.object({
    name: z.string().min(2).max(50),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    workType: z.enum(["Mason", "Carpenter", "Electrician", "Plumber", "Helper", "Painter"]),
    dailyWage: z.number().min(100).max(10000),
});

type WorkerFormData = z.infer<typeof workerSchema>;

interface EditWorkerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    worker: Worker | null;
    onSubmit: (id: string, data: WorkerFormData) => void | Promise<void>;
}

/** Modal dialog for editing an existing worker */
export function EditWorkerModal({ open, onOpenChange, worker, onSubmit }: EditWorkerModalProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<WorkerFormData>({
        resolver: zodResolver(workerSchema),
    });

    useEffect(() => {
        if (worker) {
            reset({ name: worker.name, phone: worker.phone, workType: worker.workType, dailyWage: worker.dailyWage });
        }
    }, [worker, reset]);

    const handleFormSubmit = async (data: WorkerFormData) => {
        if (worker) {
            await onSubmit(worker.id, data);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Worker</DialogTitle>
                    <DialogDescription>Update the worker details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input id="edit-name" {...register("name")} aria-invalid={!!errors.name} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-phone">Phone Number</Label>
                        <Input id="edit-phone" {...register("phone")} aria-invalid={!!errors.phone} />
                        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-workType">Work Type</Label>
                        <Select value={watch("workType")} onValueChange={(val) => setValue("workType", val as WorkType)}>
                            <SelectTrigger id="edit-workType"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {WORK_TYPES.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-wage">Daily Wage (₹)</Label>
                        <Input id="edit-wage" type="number" {...register("dailyWage", { valueAsNumber: true })} aria-invalid={!!errors.dailyWage} />
                        {errors.dailyWage && <p className="text-sm text-destructive">{errors.dailyWage.message}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
