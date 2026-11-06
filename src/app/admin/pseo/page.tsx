import AdminSeoWrapper from "@/components/admin/seo/AdminSeoWrapper";

export default async function PseoPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const tenantId = (params.tenantId as string) || "taxiaix";

    return <AdminSeoWrapper tenantId={tenantId} />;
}
