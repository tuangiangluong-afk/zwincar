import { NextResponse } from "next/server";
import {
    getGlobalDistributionMode,
    DEFAULT_HUB_DISTRIBUTION,
    DEFAULT_VEHICLE_STOCK,
    DISTRIBUTION_COOKIE_NAME,
    POPTAB_COOKIE_NAME,
    GlobalDistributionMode,
    DistributionMode,
} from "@/lib/affiliate";

export async function GET() {
    return NextResponse.json({
        globalMode: getGlobalDistributionMode(),
        popTabOnSearch: true,
        hubDistribution: DEFAULT_HUB_DISTRIBUTION,
        vehicleStock: DEFAULT_VEHICLE_STOCK,
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { globalMode, popTabOnSearch } = body;

        const response = NextResponse.json({
            success: true,
            globalMode: globalMode || "affiliate",
            popTabOnSearch: Boolean(popTabOnSearch),
        });

        if (globalMode) {
            response.cookies.set(DISTRIBUTION_COOKIE_NAME, globalMode, {
                path: "/",
                maxAge: 31536000,
                sameSite: "lax",
            });
        }

        if (typeof popTabOnSearch === "boolean") {
            response.cookies.set(POPTAB_COOKIE_NAME, String(popTabOnSearch), {
                path: "/",
                maxAge: 31536000,
                sameSite: "lax",
            });
        }

        return response;
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Erreur serveur" }, { status: 400 });
    }
}
