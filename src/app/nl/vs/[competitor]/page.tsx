import { notFound } from "next/navigation";
import { Metadata } from "next";
import VsComparisonView from "@/components/VsComparisonView";
import { VS_COMPETITORS, getVsComparison, getVsMetadata } from "@/lib/vs-data";

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ competitor: string }>;
}

export async function generateStaticParams() {
    return VS_COMPETITORS.map((c) => ({
        competitor: c.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { competitor } = await params;
    return getVsMetadata(competitor, "nl");
}

export default async function DutchVsPage({ params }: PageProps) {
    const { competitor } = await params;
    const comparison = getVsComparison(competitor);

    if (!comparison) {
        notFound();
    }

    return <VsComparisonView comparison={comparison} locale="nl" />;
}
