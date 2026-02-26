import { useWorkerStore } from "@/store/workerStore";

/** Hook for accessing worker store with convenience methods */
export function useWorkers() {
    const workers = useWorkerStore((s) => s.workers);
    const addWorker = useWorkerStore((s) => s.addWorker);
    const updateWorker = useWorkerStore((s) => s.updateWorker);
    const deleteWorker = useWorkerStore((s) => s.deleteWorker);
    const setWorkerStatus = useWorkerStore((s) => s.setWorkerStatus);

    const activeWorkers = workers.filter((w) => w.status === "Active");
    const getWorkerById = (id: string) => workers.find((w) => w.id === id);

    return {
        workers,
        activeWorkers,
        addWorker,
        updateWorker,
        deleteWorker,
        setWorkerStatus,
        getWorkerById,
    };
}
