import guidesDataFr from "./morocco-guides-fr.json";

export interface MoroccoGuide {
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
    alternateSlug?: string;
}

export const MOROCCO_GUIDES: MoroccoGuide[] = (guidesDataFr as unknown as MoroccoGuide[]) || [];

export function getGuideBySlug(slug: string): MoroccoGuide | undefined {
    return MOROCCO_GUIDES.find((g) => g.slug === slug);
}
