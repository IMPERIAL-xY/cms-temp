"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/hooks/useSidebar";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

/** Top navigation bar with search, notifications, user profile dropdown, and logout */
export function Topbar() {
    const router = useRouter();
    const toggleMobile = useSidebar((s) => s.toggleMobile);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userInitials, setUserInitials] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const name = session.user.user_metadata?.full_name || session.user.email || "User";
                setUserName(name);
                setUserEmail(session.user.email || "");
                const parts = name.split(" ");
                setUserInitials(
                    parts.length >= 2
                        ? (parts[0][0] + parts[1][0]).toUpperCase()
                        : name.substring(0, 2).toUpperCase()
                );
            }
        });
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        if (!profileOpen) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-profile-dropdown]")) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [profileOpen]);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={toggleMobile}
                    aria-label="Toggle sidebar menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="hidden sm:flex items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 w-64 h-9 bg-slate-50"
                            aria-label="Search"
                        />
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                {/* Profile dropdown */}
                <div className="relative" data-profile-dropdown>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {userInitials || <User className="h-4 w-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline text-sm font-medium text-foreground">
                            {userName || "Loading..."}
                        </span>
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                                            {userInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">{userName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="p-2">
                                <button
                                    onClick={() => { setProfileOpen(false); router.push("/settings"); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                    Settings
                                </button>
                                <button
                                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
