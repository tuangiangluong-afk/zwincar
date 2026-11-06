"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, MapPin } from "lucide-react";
import { CITIES } from "@/lib/db";

export function TenantSwitcher() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Default to first city if not found
    const currentTenantId = searchParams.get("tenantId") || Object.keys(CITIES)[0];

    // Use static source of truth from code to ensure 100% sync with user edits
    // We Map CITIES to an array and sort by name
    const tenants = Object.values(CITIES).sort((a, b) => a.name.localeCompare(b.name));

    const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTenantId = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set("tenantId", newTenantId);
        // Full reload to ensure Admin context refresh
        window.location.search = params.toString();
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <MapPin size={16} />
                </div>
                <select
                    value={currentTenantId}
                    onChange={handleSwitch}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 pl-10 p-2.5 appearance-none cursor-pointer hover:bg-white transition"
                >
                    {tenants.map((tenant) => (
                        <option key={tenant.slug} value={tenant.slug}>
                            {tenant.name} ({tenant.domain})
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    <ChevronDown size={14} />
                </div>
            </div>
        </div>
    );
}
