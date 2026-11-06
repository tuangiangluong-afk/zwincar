import guidesData from "./morocco-guides-en.json";

export interface MoroccoGuideEn {
    slug: string;
    title: string;
    shortTitle: string;
    metaDescription: string;
    heroImage: string;
    publishedAt: string;
    updatedAt: string;
    readTimeMinutes: number;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    category: string;
    summaryDirectAnswer: string;
    sections: {
        id: string;
        heading: string;
        content: string;
        callout?: {
            type: "warning" | "tip" | "info";
            text: string;
        };
    }[];
    faqs: {
        question: string;
        answer: string;
    }[];
    relatedHubs: string[];
    relatedVehicles: string[];
    alternateSlug: string;
}

export const MOROCCO_GUIDES_EN: MoroccoGuideEn[] = (guidesData as unknown as MoroccoGuideEn[]) || [];

export function getGuideEnBySlug(slug: string): MoroccoGuideEn | undefined {
    return MOROCCO_GUIDES_EN.find((g) => g.slug === slug);
}
