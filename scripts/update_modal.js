const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/BookingCheckoutModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace the leadConfirmation view (eliminate competitor affiliate bridge, make it 100% native ZwinCar WhatsApp + Voucher)
const oldLeadConfirmationBlock = content.substring(
    content.indexOf('if (leadConfirmation) {'),
    content.indexOf('return (\n        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5')
);

const newLeadConfirmationBlock = `if (leadConfirmation) {
        const waLeadText = encodeURIComponent(
            locale === "en"
                ? \`Hello ZwinCar, I just booked the \${vehicle.name} (Ref #\${leadConfirmation.bookingRef}) from \${pickupDate} to \${returnDate} in \${currentHub.name}. My name is \${fullName}, phone: \${phone}. Please confirm availability.\`
                : \`Bonjour ZwinCar, je viens de réserver la \${vehicle.name} (Réf #\${leadConfirmation.bookingRef}) du \${pickupDate} au \${returnDate} à \${currentHub.name}. Mon nom : \${fullName}, tél : \${phone}. Merci de confirmer la prise en charge.\`
        );

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs">
                <div className="w-full max-w-lg max-h-[92dvh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="shrink-0 bg-[#12161E] text-white p-4 sm:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                                <CheckCircle2 size={22} />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                                    Demande #{leadConfirmation.bookingRef} Transmise
                                </div>
                                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                                    Réservation Enregistrée !
                                </h3>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
                        {/* Direct Booking Confirmed Card */}
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-2 text-xs text-emerald-950">
                            <div className="font-bold flex items-center gap-1.5 text-emerald-900 text-sm">
                                <Check size={16} className="text-emerald-600 shrink-0" />
                                <span>Votre véhicule est bloqué pour vous</span>
                            </div>
                            <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                                Votre dossier pour la <strong>{vehicle.name}</strong> à <strong>{currentHub.name}</strong> ({pickupDate} au {returnDate}) a bien été transmis à nos agents locaux.
                            </p>
                            <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-[11px]">
                                <span>Acompte de blocage : <strong>{currency === "EUR" ? \`\${depositAcompteEur} €\` : \`\${depositAcompteMad} MAD\`}</strong></span>
                                <span>Caution : <strong>{hasFranchiseZero ? "0 € (Franchise Zéro)" : "300 €"}</strong></span>
                            </div>
                        </div>

                        {/* WhatsApp Priority Action */}
                        <div className="rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] p-4 space-y-2.5">
                            <div className="text-xs text-slate-700 leading-relaxed font-medium">
                                Pour accélérer la remise des clés et finaliser votre bon, ouvrez directement l&apos;échange avec votre agent WhatsApp dédié :
                            </div>
                            <a
                                href={\`https://wa.me/212720794046?text=\${waLeadText}\`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-black text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                            >
                                <MessageCircle size={18} />
                                <span>Valider sur WhatsApp en 1-clic</span>
                            </a>
                            <div className="text-center text-[10px] text-slate-400 font-medium">
                                ⚡ Réponse garantie en moins de 5 min (7j/7 24h/24)
                            </div>
                        </div>

                        {/* Direct Voucher Access */}
                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    router.push(\`/booking/\${leadConfirmation.bookingRef}?t=\${leadConfirmation.token}\`);
                                }}
                                className="w-full h-11 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <span>Consulter mon bon de réservation #{leadConfirmation.bookingRef}</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    `;

content = content.replace(oldLeadConfirmationBlock, newLeadConfirmationBlock);

// 2. Fix the Left Column layout and alignment in the form (clean, aligned, no weird line-breaks, purge redundant perks box)
const oldLeftCol = content.substring(
    content.indexOf('{/* Left Column: Recap, Split, Trust & Perks */}'),
    content.indexOf('{/* Right Column: Passenger Inputs & Payment Action */}')
);

const newLeftCol = `{/* Left Column: Recap, Split, Trust & Perks */}
                        <div className="md:col-span-5 space-y-3.5 order-2 md:order-1">
                            {/* Trip Summary Card */}
                            <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-3.5 space-y-2 text-xs">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                                    <div>
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                                            {t.checkoutModal.pickupLabel}
                                        </span>
                                        <span className="font-bold text-slate-900 text-xs block">
                                            {currentHub.name} ({currentHub.airportCode})
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                                            Durée
                                        </span>
                                        <span className="font-bold text-slate-900 text-xs font-mono">
                                            {days} {t.search.daysCount}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                                    <span>Du <strong>{pickupDate}</strong></span>
                                    <span>Au <strong>{returnDate}</strong></span>
                                </div>
                            </div>

                            {/* Financial Split Box - Perfectly Aligned Table */}
                            <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-3 text-xs">
                                {/* Row 1: Acompte */}
                                <div className="flex items-baseline justify-between gap-3">
                                    <div className="min-w-0 pr-1">
                                        <div className="font-bold text-slate-900 text-xs">
                                            Acompte de réservation (20%)
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Bloque fermement votre véhicule
                                        </div>
                                    </div>
                                    <div className="text-lg font-black text-[#C9572C] font-mono whitespace-nowrap shrink-0">
                                        {currency === "EUR" ? \`\${depositAcompteEur} €\` : \`\${depositAcompteMad} MAD\`}
                                    </div>
                                </div>

                                {/* Row 2: Solde */}
                                <div className="flex items-baseline justify-between gap-3 pt-2.5 border-t border-slate-200/70 text-[11px]">
                                    <div className="min-w-0 pr-1">
                                        <div className="font-bold text-slate-800">
                                            Solde à la remise des clés (80%)
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Espèces ou carte débit après état des lieux
                                        </div>
                                    </div>
                                    <div className="font-bold text-slate-900 font-mono whitespace-nowrap shrink-0">
                                        {currency === "EUR" ? \`\${balanceOnSiteEur} €\` : \`\${balanceOnSiteMad} MAD\`}
                                    </div>
                                </div>

                                {/* Row 3: Caution */}
                                <div className="flex items-baseline justify-between gap-3 pt-2.5 border-t border-slate-200/70 text-[11px]">
                                    <div className="text-slate-700 font-medium">
                                        Caution à la remise des clés
                                    </div>
                                    <div className="font-bold text-slate-900 font-mono whitespace-nowrap shrink-0">
                                        {hasFranchiseZero ? "0 € (Franchise Zéro)" : "300 € (Standard)"}
                                    </div>
                                </div>

                                {/* Guarantees */}
                                <div className="pt-2.5 border-t border-emerald-200/60 flex flex-col gap-1 text-[10px] text-emerald-800 font-semibold">
                                    <div className="flex items-center gap-1.5">
                                        <Check size={12} className="text-emerald-600 shrink-0" />
                                        <span>Acompte 100% remboursable jusqu&apos;à 48h avant</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Check size={12} className="text-emerald-600 shrink-0" />
                                        <span>Solde 80% réglé après vérification du véhicule</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust badges strip */}
                            <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-medium px-1">
                                <span>✈️ Suivi de vol direct FlightRadar</span>
                                <span>⛽ Same-to-same carburant</span>
                            </div>
                        </div>

                        `;

content = content.replace(oldLeftCol, newLeftCol);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ BookingCheckoutModal updated successfully');
