import CookieBanner from "@/components/CookieBanner";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <CookieBanner slug="home" cityName="Taxi de France" />
        </>
    );
}
