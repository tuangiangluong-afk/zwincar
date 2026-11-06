import HomePage from "./home/page";

export const revalidate = 3600;

export default function RootHomePage() {
    return <HomePage locale="fr" />;
}
