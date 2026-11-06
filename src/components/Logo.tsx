import Link from "next/link";
import { Locale } from "@/lib/i18n";

interface LogoProps {
    variant?: "full" | "icon";
    theme?: "dark" | "light";
    className?: string;
    size?: "sm" | "md" | "lg";
    locale?: Locale;
    href?: string;
}

export default function Logo({
    variant = "full",
    theme = "dark",
    className = "",
    size = "md",
    locale,
    href,
}: LogoProps) {
    const isDark = theme === "dark";
    const destination = href || (locale && locale !== "fr" ? `/${locale}` : "/");
    
    // Size scales
    const iconSizes = {
        sm: { w: 26, h: 26 },
        md: { w: 34, h: 34 },
        lg: { w: 44, h: 44 },
    };
    
    const textSizes = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-3xl",
    };

    const { w, h } = iconSizes[size];

    return (
        <Link
            href={destination}
            aria-label="ZwinCar.com - Location de voiture au Maroc sans caution"
            className={`group inline-flex items-center gap-2.5 transition-opacity hover:opacity-95 ${className}`}
        >
            {/* SVG Mark - Clean, Modern & Architectural Kinetic Z */}
            <div className="relative flex items-center justify-center shrink-0">
                <svg
                    width={w}
                    height={h}
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-300 group-hover:scale-[1.05]"
                >
                    <title>ZwinCar</title>
                    {/* Upper Horizon Blade */}
                    <polygon
                        points="9,9 39,9 41.5,12 28.5,25 24,20.5 30.5,14 9,14"
                        fill={isDark ? "#C9572C" : "#FF7A45"}
                    />
                    {/* Lower Horizon Blade */}
                    <polygon
                        points="39,39 9,39 6.5,36 19.5,23 24,27.5 17.5,34 39,34"
                        fill={isDark ? "#12161E" : "#FFFFFF"}
                    />
                </svg>
            </div>

            {/* Wordmark */}
            {variant === "full" && (
                <div className="flex items-baseline tracking-tight font-sans">
                    <span
                        className={`font-black ${textSizes[size]} tracking-tight ${
                            isDark ? "text-slate-900" : "text-white"
                        }`}
                    >
                        Zwin
                    </span>
                    <span
                        className={`font-black ${textSizes[size]} text-[#C9572C] tracking-tight ml-0.5`}
                    >
                        Car
                    </span>
                    <span
                        className={`font-semibold text-xs ml-1 px-1.5 py-0.5 rounded tracking-wide uppercase ${
                            isDark
                                ? "bg-slate-900 text-white font-bold"
                                : "bg-white/20 text-white font-bold"
                        }`}
                    >
                        .com
                    </span>
                </div>
            )}
        </Link>
    );
}
