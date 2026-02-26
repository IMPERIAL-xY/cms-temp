"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
    className?: string;
    count?: number;
}

/** Skeleton loading placeholder */
export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "h-4 w-full animate-pulse rounded-md bg-muted",
                        className
                    )}
                />
            ))}
        </div>
    );
}
