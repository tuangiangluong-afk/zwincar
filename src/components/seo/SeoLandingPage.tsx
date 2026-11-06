import Link from "next/link";
import { BookingWidget } from "@/components/BookingWidget";
import { Phone, CheckCircle, MapPin, Clock, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/Footer";
import { getTheme } from "@/lib/theme";
import CallButton from "@/components/CallButton";

interface SeoPageProps {
    page: {
        h1_title: string;
        content_json: any[];
        target_city: string;
        target_service: string;
    };
    tenant: {
        id: string;
        name: string;
        phone_number: string | null;
        primary_color: string | null;
    };
}

export default function SeoLandingPage({ page, tenant }: SeoPageProps) {
    const primaryColor = tenant.primary_color || '#facc15';

    return (
        <div className="bg-white">
            {/* Hero Section with Booking Widget */}
            <section className="relative bg-neutral-900 text-white pt-24 pb-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-sm font-medium text-yellow-400">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                </span>
                                Disponible à {page.target_city}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                                {page.h1_title}
                            </h1>
                            <p className="text-xl text-gray-300">
                                Service officiel {tenant.name}. Chauffeurs professionnels, prix fixes et réservation immédiate.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <CallButton
                                    phoneNumber={tenant.phone_number || ''}
                                    cityName={page.target_city}
                                    theme={getTheme(page.target_city.toLowerCase())}
                                    className="flex items-center gap-3 bg-yellow-400 text-black px-6 py-4 rounded-xl font-bold hover:bg-yellow-300 transition"
                                >
                                    <Phone size={20} />
                                    {tenant.phone_number}
                                </CallButton>
                                <div className="flex items-center gap-2 text-sm text-gray-400 px-4">
                                    <ShieldCheck size={16} />
                                    Transport Agréé
                                </div>
                            </div>
                        </div>

                        {/* Widget Container */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-[2rem] blur opacity-30"></div>
                            <BookingWidget city={{ name: page.target_city } as any} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Generated Content Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose prose-lg mx-auto prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-gray-600 prose-a:text-yellow-600 hover:prose-a:text-yellow-700">
                        {/* Dynamic Content Rendering */}
                        {page.content_json?.map((block: any, index: number) => {
                            if (block.type === 'hero') return null; // Already rendered h1

                            if (block.type === 'text' || block.type === 'paragraph') {
                                return <div key={index} dangerouslySetInnerHTML={{ __html: block.content }} className="mb-8" />;
                            }

                            if (block.type === 'h2') {
                                return <h2 key={index} className="text-3xl font-bold mt-12 mb-6">{block.content}</h2>;
                            }

                            return null;
                        })}

                        {/* Fallback Static Content if JSON is empty/simple */}
                        {(!page.content_json || page.content_json.length === 0) && (
                            <div className="space-y-8">
                                <p className="text-xl leading-relaxed">
                                    Besoin d'un taxi à <strong>{page.target_city}</strong> ? {tenant.name} est votre partenaire de confiance pour tous vos déplacements.
                                    Que ce soit pour un transfert gare, aéroport ou un rendez-vous médical, nous assurons un service ponctuel et confortable.
                                </p>

                                <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <Clock className="w-10 h-10 text-yellow-500 mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Ponctualité Garantie</h3>
                                        <p className="text-gray-600">Nous suivons votre train ou vol en temps réel pour vous attendre à l'arrivée.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <ShieldCheck className="w-10 h-10 text-yellow-500 mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Chauffeurs Agréés</h3>
                                        <p className="text-gray-600">Tous nos chauffeurs sont professionnels, formés et possèdent une carte professionnelle à jour.</p>
                                    </div>
                                </div>

                                <h2>Pourquoi choisir {tenant.name} à {page.target_city} ?</h2>
                                <p>
                                    Notre flotte de véhicules récents (Berline, Van) s'adapte à tous vos besoins.
                                    Réservez votre course en quelques clics via notre module en ligne ou par téléphone au <strong>{tenant.phone_number}</strong>.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>


            {/* Internal Linking Mesh */}
            {/* Internal Linking Mesh */}
            <Footer config={{
                name: tenant.name,
                city: page.target_city,
                domain: tenant.id, // using ID as domain fallback
                slug: tenant.id,
                phoneNumber: tenant.phone_number || "",
                email: "",
                heroImage: "",
                description: "",
                meta: { title: "", description: "" },
                features: [],
                pricing: { base: "", description: "" },
                hospitals: [],
                stations: [],
                neighborhoods: [],
                points_of_interest: {
                    hotels: [],
                    nightlife: [],
                    monuments: [],
                    parking_difficulty: ""
                }
            }} />
        </div >
    );
}

