export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Tableau de Bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                    <h3 className="text-sm font-medium text-neutral-500 uppercase">Visiteurs (24h)</h3>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">1,240</p>
                    <span className="text-xs text-green-500 font-medium">+12% vs hier</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                    <h3 className="text-sm font-medium text-neutral-500 uppercase">Réservations (Est.)</h3>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">45</p>
                    <span className="text-xs text-neutral-400">Via bouton "Appeler"</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                    <h3 className="text-sm font-medium text-neutral-500 uppercase">Pages Guides (pSEO)</h3>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">24</p>
                    <span className="text-xs text-blue-500 font-medium">Auto-générées</span>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 text-center">
                <div className="max-w-md mx-auto">
                    <h2 className="text-lg font-bold text-neutral-900 mb-2">Bienvenue dans TaxiCMS v4</h2>
                    <p className="text-neutral-500 mb-6">
                        Sélectionnez une section dans la barre latérale pour commencer à éditer votre contenu ou gérer votre flotte.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="/admin/pages" className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition">
                            Éditer une Page
                        </a>
                        <a href="/admin/guides" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition">
                            Ajouter un POI Guide
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
