import { Database } from "@/types/database.types";
import { CityConfig } from "@/lib/db";
import { generateCityFAQs } from "@/lib/faq-generator";

type DBFaq = Database['public']['Tables']['faqs']['Row'];

interface FAQProps {
    city: string;
    type: "general" | "medical" | "airport" | "long_distance" | "pmr";
    faqs?: DBFaq[] | null; // Optional: From Supabase
    cityConfig?: CityConfig | null; // Optional: For richer generation
}

export function FAQ({ city, type, faqs, cityConfig }: FAQProps) {
    // Check if dynamic FAQs exist for this type
    const dynamicFaqs = faqs?.filter(f => f.category === type);
    const hasDynamicFaqs = dynamicFaqs && dynamicFaqs.length > 0;

    // Generate AI-enhanced FAQs if no dynamic FAQs and cityConfig is provided
    const generatedFaqs = cityConfig
        ? generateCityFAQs(cityConfig, type === "long_distance" ? "general" : type, 4)
        : null;

    // Legacy fallback templates (used if no cityConfig)
    const questions = {
        general: [
            {
                q: `Comment réserver un taxi à ${city} ?`,
                a: `Vous pouvez réserver votre taxi à ${city} directement en ligne via notre formulaire sécurisé ou par téléphone. Nous assurons une disponibilité 24h/24 et 7j/7 pour vos déplacements locaux et longue distance.`
            },
            {
                q: "Acceptez-vous la carte bancaire ?",
                a: "Oui, tous nos chauffeurs partenaires acceptent le paiement par carte bancaire (Visa, Mastercard, Amex) ainsi que les espèces. Une facture vous sera remise à la fin de la course."
            },
            {
                q: `Quels sont les temps d'attente à ${city} ?`,
                a: `En réservant à l'avance, votre chauffeur sera là à l'heure convenue sans attente. Pour une demande immédiate, le temps d'approche moyen à ${city} est de 10 à 15 minutes selon la circulation.`
            },
            {
                q: "Vos tarifs sont-ils fixes ?",
                a: "Pour les courses gares et aéroports, nous pouvons proposer des forfaits fixes. Pour les courses locales, le tarif est réglementé par le compteur horokilométrique, garantissant une transparence totale."
            }
        ],
        medical: [
            {
                q: "Le transport est-il remboursé par la Sécurité Sociale ?",
                a: `Oui, nos taxis sont conventionnés CPAM. Si vous disposez d'une prescription médicale de transport (Bon de Transport), vos frais seront pris en charge à 65% ou 100% selon votre situation.`
            },
            {
                q: "Pratiquez-vous le tiers payant ?",
                a: "Absolument. Sur présentation de votre carte Vitale et de votre prescription, vous n'avez pas à avancer la part Sécurité Sociale. Nous gérons les démarches administratives."
            },
            {
                q: "Accompagnez-vous les patients dans le service ?",
                a: "Oui, notre service de taxi conventionné inclut l'aide à la marche et l'accompagnement jusqu'au service hospitalier si nécessaire. Nos chauffeurs sont formés pour l'assistance aux personnes."
            }
        ],
        airport: [
            {
                q: "Que se passe-t-il si mon vol/train a du retard ?",
                a: "Aucun souci. Nous suivons votre vol ou train en temps réel grâce à votre numéro de dossier. Votre chauffeur s'adapte à votre heure d'arrivée réelle sans frais supplémentaires."
            },
            {
                q: "Le chauffeur m'attendra-t-il avec une pancarte ?",
                a: "Oui, pour les accueils gares et aéroports, votre chauffeur vous attendra avec une pancarte nominative (ou tablette) directement à la sortie des voyageurs ou en tête de quai."
            },
            {
                q: "Proposez-vous des sièges auto pour enfants ?",
                a: "Oui, sur demande préalable lors de la réservation, nous pouvons équiper le véhicule de sièges bébé ou réhausseurs adaptés à l'âge de vos enfants, gratuitement."
            }
        ],
        long_distance: [
            {
                q: "Comment fonctionne la tarification longue distance ?",
                a: "Pour les trajets longue distance, nous privilégions le forfait fixe convenu à l'avance. Cela vous évite les surprises du compteur en cas d'embouteillage. Demandez votre devis gratuit."
            },
            {
                q: "Le véhicule est-il confortable pour de longs trajets ?",
                a: "Absolument. Notre flotte 'Grand Tourisme' est composée de berlines et vans récents (Mercedes Classe E, V-Class) offrant un confort optimal : climatisation bizone, chargeurs, bouteilles d'eau."
            },
            {
                q: "Puis-je réserver pour un aller-retour ?",
                a: "Oui, nous pouvons assurer l'aller-retour, même avec plusieurs jours d'écart. De plus, la réservation aller-retour peut parfois vous faire bénéficier d'une remise sur le trajet global."
            }
        ]
    };

    // Determine which questions to use
    const currentQuestions = generatedFaqs
        ? generatedFaqs.map(f => ({ q: f.question, a: f.answer }))
        : ((questions as Record<string, { q: string; a: string }[]>)[type] || questions.general);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto max-w-4xl px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
                    Questions Fréquentes <span className="text-yellow-500">.</span>
                </h2>
                <div className="grid gap-6">
                    {hasDynamicFaqs ? (
                        dynamicFaqs!.map((faq) => (
                            <div key={faq.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-yellow-400/30 transition shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    <span className="text-yellow-500 font-black">?</span> {faq.question}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm pl-6 border-l-2 border-yellow-200">
                                    {faq.answer}
                                </p>
                            </div>
                        ))
                    ) : (
                        currentQuestions.map((item, i) => (
                            <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-yellow-400/30 transition shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    <span className="text-yellow-500 font-black">?</span> {item.q}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm pl-6 border-l-2 border-yellow-200">
                                    {item.a}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
