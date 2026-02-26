"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { WorkerFilters } from "@/components/workers/WorkerFilters";
import { WorkerTable } from "@/components/workers/WorkerTable";
import { AddWorkerModal } from "@/components/workers/AddWorkerModal";
import { EditWorkerModal } from "@/components/workers/EditWorkerModal";
import { DeleteConfirmDialog } from "@/components/workers/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWorkerStore } from "@/store/workerStore";
import { Worker } from "@/types";
import { ROWS_PER_PAGE } from "@/lib/constants";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/** Workers management page with CRUD operations */
export default function WorkersPage() {
    const { workers, addWorker, updateWorker, deleteWorker } = useWorkerStore();

    const [search, setSearch] = useState("");
    const [workTypeFilter, setWorkTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

    const filtered = useMemo(() => {
        return workers.filter((w) => {
            const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
                w.phone.includes(search);
            const matchesType = workTypeFilter === "all" || w.workType === workTypeFilter;
            return matchesSearch && matchesType;
        });
    }, [workers, search, workTypeFilter]);

    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    const handleAdd = async (data: { name: string; phone: string; workType: "Mason" | "Carpenter" | "Electrician" | "Plumber" | "Helper" | "Painter"; dailyWage: number }) => {
        await addWorker(data);
        toast.success("Worker added successfully!");
    };

    const handleEdit = async (id: string, data: { name: string; phone: string; workType: "Mason" | "Carpenter" | "Electrician" | "Plumber" | "Helper" | "Painter"; dailyWage: number }) => {
        await updateWorker(id, data);
        toast.success("Worker updated successfully!");
    };

    const handleDelete = async () => {
        if (selectedWorker) {
            await deleteWorker(selectedWorker.id);
            toast.success("Worker deleted successfully!");
            setSelectedWorker(null);
        }
    };

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate">
            <PageHeader title="Workers" description="Manage your workforce">
                <Button onClick={() => setAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Worker
                </Button>
            </PageHeader>

            <Card className="mt-6 p-6">
                <WorkerFilters
                    search={search}
                    onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
                    workTypeFilter={workTypeFilter}
                    onWorkTypeChange={(val) => { setWorkTypeFilter(val); setCurrentPage(1); }}
                />

                <div className="mt-4">
                    {paginated.length === 0 ? (
                        <EmptyState title="No workers found" description="Try adjusting your search or add a new worker." />
                    ) : (
                        <WorkerTable
                            workers={paginated}
                            onView={(w) => { setSelectedWorker(w); setEditOpen(true); }}
                            onEdit={(w) => { setSelectedWorker(w); setEditOpen(true); }}
                            onDelete={(w) => { setSelectedWorker(w); setDeleteOpen(true); }}
                        />
                    )}
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </Card>

            <AddWorkerModal open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} />
            <EditWorkerModal open={editOpen} onOpenChange={setEditOpen} worker={selectedWorker} onSubmit={handleEdit} />
            <DeleteConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                workerName={selectedWorker?.name || ""}
                onConfirm={handleDelete}
            />
        </motion.div>
    );
}
