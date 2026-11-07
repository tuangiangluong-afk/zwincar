import Link from "next/link";
import { LayoutDashboard, FileText, Car, MessageCircle, MapPin, Database, Settings, LogOut, Star, Share2, Building2 } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminFromToken } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Vérification du token admin natif ZwinCar
    const cookieStore = await cookies();
    const token = cookieStore.get("zwincar_admin_token")?.value;
    const adminUser = token ? getAdminFromToken(token) : null;

    // 2. Fallback Supabase si configuré
    let email = adminUser?.email;
    if (!email) {
        try {
            const supabase = await createSupabaseServerClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) email = user.email;
        } catch {
            // ignore
        }
    }

    // Si aucune session admin valide, redirection stricte vers /login
    if (!email) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-neutral-900">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 text-white flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold tracking-tight">ZwinCar<span className="text-[#C9572C]">.</span></h1>
                    <p className="text-xs text-neutral-400 mt-1">Supervision Nationale Maroc</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 mt-2 px-2">Opérations</div>
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-white/10 text-white">
                        <LayoutDashboard size={18} />
                        Dashboard National
                    </Link>
                    <Link href="/admin/whatsapp" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-emerald-400 hover:bg-white/5 transition">
                        <MessageCircle size={18} />
                        WhatsApp Studio Live
                    </Link>
                    <Link href="/vendor/dashboard" target="_blank" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-blue-400 hover:bg-white/5 transition">
                        <Building2 size={18} />
                        Portail Loueurs Live
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

                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 mt-6 px-2">Business & Flotte</div>
                    <Link href="/admin/vehicles" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition">
                        <Car size={18} />
                        Catalogue Modèles
                    </Link>
                    <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition">
                        <Star size={18} />
                        Avis Clients
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#C9572C] flex items-center justify-center text-white font-bold">
                                {email?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white truncate max-w-[130px]">{email}</div>
                                <div className="text-[10px] text-neutral-400">Super Admin</div>
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-xs">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Supervision Opérationnelle Maroc • ZwinCar Cloud
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/" target="_blank" className="text-xs text-[#C9572C] font-bold hover:underline">
                            Voir le site en direct ↗
                        </a>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
