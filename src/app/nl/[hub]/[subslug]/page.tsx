import type { Metadata } from "next";
import { getLocalizedStaticParams, getLocalizedMetadata } from "@/lib/localized-page-helper";
import LocalizedPageRenderer from "@/components/pSEO/LocalizedPageRenderer";

interface PageProps {
    params: Promise<{ hub: string; subslug: string }>;
}

export async function generateStaticParams() {
    return getLocalizedStaticParams("nl");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { hub, subslug } = await params;
    return getLocalizedMetadata("nl", hub, subslug);
}

export default async function DutchSubpage({ params }: PageProps) {
    const { hub, subslug } = await params;
    return <LocalizedPageRenderer locale="nl" hubSlug={hub} subslug={subslug} />;
}
