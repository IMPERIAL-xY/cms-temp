"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsStore } from "@/store/settingsStore";
import { CURRENCIES } from "@/lib/constants";
import { CurrencyCode } from "@/types";
import { Loader2, Save } from "lucide-react";

const settingsSchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    contractorName: z.string().min(2, "Contractor name is required"),
    contactNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/** Settings page for company and contractor information */
export default function SettingsPage() {
    const { settings, updateSettings } = useSettingsStore();
    const [isLoading, setIsLoading] = useState(false);
    const [currency, setCurrency] = useState<CurrencyCode>(settings.currency);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            companyName: settings.companyName,
            contractorName: settings.contractorName,
            contactNumber: settings.contactNumber,
        },
    });

    // Sync form when settings load from Supabase
    useEffect(() => {
        reset({
            companyName: settings.companyName,
            contractorName: settings.contractorName,
            contactNumber: settings.contactNumber,
        });
        setCurrency(settings.currency);
    }, [settings, reset]);

    const onSubmit = async (data: SettingsFormData) => {
        setIsLoading(true);
        await updateSettings({ ...data, currency });
        setIsLoading(false);
        toast.success("Settings saved successfully!");
    };

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate">
            <PageHeader title="Settings" description="Manage your application settings" />

            <Card className="mt-6 max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-base">Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input id="companyName" {...register("companyName")} aria-invalid={!!errors.companyName} />
                            {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contractorName">Contractor Name</Label>
                            <Input id="contractorName" {...register("contractorName")} aria-invalid={!!errors.contractorName} />
                            {errors.contractorName && <p className="text-sm text-destructive">{errors.contractorName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactNumber">Contact Number</Label>
                            <Input id="contactNumber" {...register("contactNumber")} aria-invalid={!!errors.contactNumber} />
                            {errors.contactNumber && <p className="text-sm text-destructive">{errors.contactNumber.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency">Default Currency</Label>
                            <Select value={currency} onValueChange={(val) => setCurrency(val as CurrencyCode)}>
                                <SelectTrigger id="currency" aria-label="Select currency"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {CURRENCIES.map((c) => (
                                        <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" />Save Settings</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
