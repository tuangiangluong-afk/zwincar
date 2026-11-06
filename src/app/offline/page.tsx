import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hors ligne — ZwinCar",
    robots: { index: false, follow: false },
};

export default function OfflinePage() {
    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#12161E] text-xl font-black text-white">
                Z
            </div>
            <h1 className="text-2xl font-black text-slate-900">Vous êtes hors ligne</h1>
            <p className="max-w-md text-sm text-slate-600">
                Votre voucher reste disponible dans l&apos;application si vous l&apos;avez déjà ouvert. Sinon,
                reconnectez-vous au réseau : l&apos;équipe reste joignable sur WhatsApp 24/7.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                    href="/"
                    className="rounded-xl bg-[#C9572C] px-4 py-2.5 text-sm font-bold text-white"
                >
                    Réessayer
                </Link>
                <a
                    href="https://wa.me/212600000000"
                    className="rounded-xl border border-[#E7DFD5] px-4 py-2.5 text-sm font-bold text-slate-800"
                >
                    WhatsApp 24/7
                </a>
            </div>
        </main>
    );
}
