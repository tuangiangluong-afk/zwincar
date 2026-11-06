import Link from "next/link";

interface LogoProps {
    variant?: "full" | "icon";
    theme?: "dark" | "light";
    className?: string;
    size?: "sm" | "md" | "lg";
}

export default function Logo({
    variant = "full",
    theme = "dark",
    className = "",
    size = "md",
}: LogoProps) {
    const isDark = theme === "dark";
    
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
            href="/"
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
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                >
                    {/* Background rounded container with subtle shadow & architectural geometry */}
                    <rect
                        width="48"
                        height="48"
                        rx="12"
                        className={isDark ? "fill-[#0E1420]" : "fill-[#FAF7F2]"}
                    />
                    <rect
                        x="0.75"
                        y="0.75"
                        width="46.5"
                        height="46.5"
                        rx="11.25"
                        stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(18,22,30,0.08)"}
                        strokeWidth="1.5"
                    />

                    {/* Dynamic 'Z' Horizon Road Geometry */}
                    {/* Top horizon bar */}
                    <path
                        d="M13 15.5C13 14.6716 13.6716 14 14.5 14H33.5C34.3284 14 35 14.6716 35 15.5C35 16.3284 34.3284 17 33.5 17H19.2L34.1 30.6C34.68 31.13 35 31.88 35 32.66V33.5C35 34.33 34.33 35 33.5 35H14.5C13.67 35 13 34.33 13 33.5C13 32.67 13.67 32 14.5 32H28.9L13.9 18.3C13.33 17.78 13 17.04 13 16.27V15.5Z"
                        fill="url(#zwincar-terracotta-grad)"
                    />

                    {/* Sleek desert apex arc / subtle arch motif */}
                    <circle cx="34" cy="15.5" r="2.2" fill="#E58B24" />
                    <circle cx="14" cy="33.5" r="2.2" fill="#E58B24" />

                    {/* Gradients */}
                    <defs>
                        <linearGradient
                            id="zwincar-terracotta-grad"
                            x1="13"
                            y1="14"
                            x2="35"
                            y2="35"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0%" stopColor="#E56A38" />
                            <stop offset="60%" stopColor="#C9572C" />
                            <stop offset="100%" stopColor="#A83E16" />
                        </linearGradient>
                    </defs>
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
