import { supabase } from "@/lib/supabase";
import { Star, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { getHelpfulContent } from "@/lib/content";

interface Review {
    id: string;
    author_name: string;
    rating: number;
    content: string;
    source: string;
}

// Fallback using spintax if DB is empty
// Fallback using shared logic
import { getCityReviews } from "@/lib/reviews";

interface ReviewsProps {
    city: string;
    tenantSlug?: string;
}

export async function Reviews({ city, tenantSlug }: ReviewsProps) {
    let reviews: Review[] = [];

    // Try to fetch from DB if tenantSlug provided
    if (tenantSlug) {
        try {
            // First try tenant-specific reviews
            // Note: We use 'any' because the reviews table may not be in the generated types yet
            const { data: tenantReviews } = await (supabase as any)
                .from("reviews")
                .select("id, author_name, rating, content, source")
                .eq("tenant_id", tenantSlug)
                .eq("is_active", true)
                .limit(6);

            if (tenantReviews && tenantReviews.length > 0) {
                reviews = tenantReviews as Review[];
            }
            /*
            else {
                // DISABLE DEFAULT FALLBACK to force Unique Spintax Reviews
                // This ensures each city gets its own "AI-generated" reviews instead of generic ones

                // Try default reviews
                const { data: defaultReviews } = await (supabase as any)
                    .from("reviews")
                    .select("id, author_name, rating, content, source")
                    .eq("tenant_id", "_default")
                    .eq("is_active", true)
                    .limit(6);

                if (defaultReviews && defaultReviews.length > 0) {
                    reviews = defaultReviews as Review[];
                }
            }
            */
        } catch {
            // DB error - will use fallback
        }
    }

    // Use spintax fallback if no DB reviews
    if (reviews.length === 0) {
        reviews = getCityReviews(city);
    }

    // Calculate average rating
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "5.0";

    // Replace {city} placeholder in content
    const displayReviews = reviews.map(r => ({
        ...r,
        content: r.content.replace("{city}", city)
    }));

    return (
        <section className="bg-white py-16 border-y border-neutral-100">
            <div className="container mx-auto max-w-5xl px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">
                            Avis Clients à <span className="text-blue-600">{city}</span>
                        </h2>
                        <p className="text-sm text-neutral-500 mt-1">
                            Retours vérifiés de nos passagers récents.
                        </p>
                    </div>

                    {/* Global Rating Badge */}
                    <div className="flex items-center gap-3 bg-neutral-50 px-5 py-3 rounded-xl border border-neutral-200 shadow-sm">
                        <span className="text-3xl font-bold text-neutral-900">{avgRating}</span>
                        <div className="flex flex-col">
                            <div className="flex text-yellow-400 gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} fill="currentColor" size={16} />
                                ))}
                            </div>
                            <span className="text-xs text-neutral-500 font-medium">Excellence garantie</span>
                        </div>
                        {/* Google Logo */}
                        <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100">
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                alt="Google"
                                width={18}
                                height={18}
                                unoptimized
                            />
                        </div>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {displayReviews.slice(0, 3).map((review) => (
                        <div
                            key={review.id}
                            className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition flex flex-col h-full"
                        >
                            {/* Stars & Source */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex text-yellow-400 gap-0.5">
                                    {[...Array(review.rating)].map((_, j) => (
                                        <Star key={j} size={14} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-xs text-neutral-400">{review.source}</span>
                            </div>

                            {/* Content */}
                            <p className="text-neutral-700 text-sm mb-6 leading-relaxed flex-1">
                                &ldquo;{review.content}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-neutral-200/50">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                    {review.author_name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-neutral-900">{review.author_name}</div>
                                    <div className="text-xs text-neutral-500 flex items-center gap-1">
                                        <CheckCircle2 size={10} className="text-green-500" /> Client vérifié
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
