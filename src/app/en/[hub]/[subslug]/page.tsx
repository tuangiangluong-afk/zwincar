import type { Metadata } from "next";
import { getLocalizedStaticParams, getLocalizedMetadata } from "@/lib/localized-page-helper";
import LocalizedPageRenderer from "@/components/pSEO/LocalizedPageRenderer";

interface PageProps {
    params: Promise<{ hub: string; subslug: string }>;
}

export async function generateStaticParams() {
    return getLocalizedStaticParams("en");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { hub, subslug } = await params;
    return getLocalizedMetadata("en", hub, subslug);
}

export default async function EnglishSubpage({ params }: PageProps) {
    const { hub, subslug } = await params;
    return <LocalizedPageRenderer locale="en" hubSlug={hub} subslug={subslug} />;
}
