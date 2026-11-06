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
            {/* SVG Mark */}
            <div className="relative flex items-center justify-center">
                <svg
                    width={w}
                    height={h}
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-300 group-hover:scale-[1.04]"
                >
                    <defs>
                        <linearGradient id="zwincar-bg-comp" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#171C26"/>
                            <stop offset="100%" stopColor="#0B0E14"/>
                        </linearGradient>

                        <linearGradient id="zwincar-ribbon-top-comp" x1="10" y1="12" x2="38" y2="24" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FF7A45"/>
                            <stop offset="50%" stopColor="#C9572C"/>
                            <stop offset="100%" stopColor="#9E3510"/>
                        </linearGradient>

                        <linearGradient id="zwincar-ribbon-bot-comp" x1="10" y1="24" x2="38" y2="36" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#9E3510"/>
                            <stop offset="50%" stopColor="#C9572C"/>
                            <stop offset="100%" stopColor="#E58B24"/>
                        </linearGradient>

                        <linearGradient id="zwincar-gold-comp" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#F5A623"/>
                            <stop offset="100%" stopColor="#D48810"/>
                        </linearGradient>
                    </defs>

                    {/* Container */}
                    <rect
                        width="48"
                        height="48"
                        rx="13"
                        fill={isDark ? "url(#zwincar-bg-comp)" : "#12161E"}
                    />
                    <rect
                        x="0.75"
                        y="0.75"
                        width="46.5"
                        height="46.5"
                        rx="12.25"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1.5"
                    />

                    {/* Subtle Road Curve Glow */}
                    <path d="M6 34C18 30 30 30 42 34" stroke="rgba(201,87,44,0.18)" strokeWidth="2" strokeLinecap="round"/>

                    {/* Upper Speed Wing (Top of Z) */}
                    <path
                        d="M12 15C12 14.17 12.67 13.5 13.5 13.5H33.2C34.6 13.5 35.4 15.1 34.5 16.2L24.8 28H15.5L25.2 16.5H13.5C12.67 16.5 12 15.83 12 15Z"
                        fill="url(#zwincar-ribbon-top-comp)"
                    />

                    {/* Lower Speed Wing (Bottom of Z) */}
                    <path
                        d="M36 33C36 33.83 35.33 34.5 34.5 34.5H14.8C13.4 34.5 12.6 32.9 13.5 31.8L23.2 20H32.5L22.8 31.5H34.5C35.33 31.5 36 32.17 36 33Z"
                        fill="url(#zwincar-ribbon-bot-comp)"
                    />

                    {/* Dynamic Center Blade */}
                    <path d="M21 21.5L27 26.5" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" strokeOpacity="0.85"/>

                    {/* Sahara Golden Pips */}
                    <circle cx="34.5" cy="14.8" r="2.2" fill="url(#zwincar-gold-comp)" />
                    <circle cx="13.5" cy="33.2" r="2.2" fill="url(#zwincar-gold-comp)" />
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
                                ? "bg-[#C9572C]/10 text-[#C9572C]"
                                : "bg-white/10 text-white/80"
                        }`}
                    >
                        .com
                    </span>
                </div>
            )}
        </Link>
    );
}
