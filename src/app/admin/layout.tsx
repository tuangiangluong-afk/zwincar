import Link from "next/link";
import { LayoutDashboard, FileText, Car, MessageCircle, MapPin, Database, Settings, LogOut, Star, Share2 } from "lucide-react";
import { TenantSwitcher } from "@/components/admin/TenantSwitcher";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Redirect to login if not authenticated
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-neutral-900">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 text-white flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold tracking-tight">ZwinCar<span className="text-[#C9572C]">.</span></h1>
                    <p className="text-xs text-neutral-500 mt-1">Admin OS & Distribution v2.0</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 mt-2 px-2">Général</div>
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-white/10 text-white">
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>

                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 mt-6 px-2">Contenu & SEO</div>
                    <Link href="/admin/pages" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition">
                        <FileText size={18} />
                        Pages & Textes
                    </Link>
                    <Link href="/admin/guides" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition">
                        <MapPin size={18} />
                        Guides (POIs)
                    </Link>
                    <Link href="/admin/pseo" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-yellow-500 hover:bg-white/5 hover:text-white transition">
                        <Database size={18} />
                        Machine SEO
                    </Link>

                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 mt-6 px-2">Business & Monétisation</div>
                    <Link href="/admin/affiliation" className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg text-orange-400 hover:bg-white/5 hover:text-white transition">
                        <Share2 size={18} />
                        Distribution & Affiliation
                    </Link>
                    <Link href="/admin/vehicles" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition">
                        <Car size={18} />
                        Flotte / Véhicules
                    </Link>
                    <Link href="/admin/faq" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition">
                        <MessageCircle size={18} />
                        FAQ & Questions
                    </Link>
                    <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition">
                        <Star size={18} />
                        Avis Clients
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition">
                        <Settings size={18} />
                        Paramètres & Analytics
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-neutral-900 font-bold">
                                {user.email?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white truncate max-w-[120px]">{user.email}</div>
                                <div className="text-xs text-neutral-500">Administrateur</div>
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar / Workspace Switcher */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Workspace actuel :</span>
                        <TenantSwitcher />
                    </div>
                    <div>
                        <a href="/" target="_blank" className="text-sm text-blue-600 font-medium hover:underline">Voir le site en ligne</a>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
