"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            await supabaseBrowser.auth.signOut();
        } catch {
            // ignore
        }
        router.push("/login");
        router.refresh();
    }

    return (
        <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Se déconnecter"
        >
            <LogOut size={16} />
        </button>
    );
}
