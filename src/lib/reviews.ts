import { getHelpfulContent } from "@/lib/content";


// Re-exporting helper from spintax or duplicating simple logic if not exported
// Ideally, we modifies spintax.ts to export them. checking spintax.ts...
// It exports 'spin' and 'getSpintaxContent'. It does NOT export seededRandom/stringHash. 
// I will keep this self-contained or use a deterministic approach based on city name.

export interface Review {
    id: string;
    author_name: string;
    rating: number;
    content: string;
    source: "Google" | "TripAdvisor" | "Péages";
    date: string;
}

export function getCityReviews(city: string): Review[] {
    // Generate reviews using Spintax to ensure local flavor
    // We use context 'HUB' as these are generic positive signals usually
    return [
        {
            id: "1",
            author_name: getHelpfulContent("review_name_1", city, 'HUB'),
            content: getHelpfulContent("review_text_1", city, 'HUB'),
            rating: 5,
            source: "Google",
            date: "2024-09-12"
        },
        {
            id: "2",
            author_name: getHelpfulContent("review_name_2", city, 'HUB'),
            content: getHelpfulContent("review_text_2", city, 'HUB'),
            rating: 5,
            source: "Google",
            date: "2024-10-05"
        },
        {
            id: "3",
            author_name: getHelpfulContent("review_name_3", city, 'HUB'),
            content: getHelpfulContent("review_text_3", city, 'HUB'),
            rating: 5,
            source: "Google",
            date: "2024-11-20"
        },
    ];
}

export function getCityAggregateRating(city: string) {
    const reviews = getCityReviews(city);
    // Create a deterministic "fake" total count based on city string length/hash
    // avoiding 'real' random that changes on every rebuild if using Math.random()
    // We want it to be static per city but different between cities.

    let hash = 0;
    for (let i = 0; i < city.length; i++) hash = ((hash << 5) - hash) + city.charCodeAt(i);
    hash = Math.abs(hash);

    const count = 80 + (hash % 150); // Between 80 and 230 reviews
    const avg = 4.7 + ((hash % 30) / 100); // Between 4.7 and 4.99

    return {
        ratingValue: avg.toFixed(1),
        reviewCount: count.toString(),
        bestRating: "5",
        worstRating: "1"
    };
}
