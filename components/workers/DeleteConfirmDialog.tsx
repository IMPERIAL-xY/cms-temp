"use client";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workerName: string;
    onConfirm: () => void;
}

/** Confirmation dialog for deleting a worker */
export function DeleteConfirmDialog({ open, onOpenChange, workerName, onConfirm }: DeleteConfirmDialogProps) {
    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Worker"
            description={`Are you sure you want to delete "${workerName}"? This action cannot be undone.`}
            onConfirm={onConfirm}
            confirmLabel="Delete"
            variant="destructive"
        />
    );
}
