"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    iconColor?: string;
    iconBg?: string;
}

/** Dashboard stats card with icon, value, and trend indicator */
export function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    iconColor = "text-blue-600",
    iconBg = "bg-blue-50",
}: StatsCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
        >
            <Card className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{title}</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
                            {trend && (
                                <p
                                    className={cn(
                                        "mt-1 text-xs font-medium",
                                        trendUp ? "text-green-600" : "text-red-600"
                                    )}
                                >
                                    {trendUp ? "↑" : "↓"} {trend}
                                </p>
                            )}
                        </div>
                        <div className={cn("rounded-xl p-3", iconBg)}>
                            <Icon className={cn("h-6 w-6", iconColor)} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
