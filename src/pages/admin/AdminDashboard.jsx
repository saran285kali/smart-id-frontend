import { useAuth } from "../../hooks/useAuth"

export default function AdminDashboard() {
    const { logout, user } = useAuth()

    const handleLogout = () => {
        logout()
        window.location.href = "/" // force redirect after logout
    }

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col">

            {/* Top Bar */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                    </div>
                    <h1 className="text-xl font-black tracking-tight">
                        Admin <span className="text-emerald-500">Control</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Role Verification</p>
                        <p className="text-sm font-black text-emerald-500">{user?.role?.toUpperCase()}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 text-xs font-black uppercase tracking-widest bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-8 lg:p-12">
                <div className="rounded-[2.5rem] border border-slate-800 bg-[#0f172a] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="size-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500">
                            <span className="material-symbols-outlined text-4xl">dashboard</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">System Infrastructure</h2>
                            <p className="text-slate-500 font-medium">Core command center for HealthSync network</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        {['User Management', 'Security Matrix', 'Audit Vault'].map((item) => (
                            <div key={item} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-emerald-500/50 transition-all group">
                                <p className="text-slate-400 font-bold mb-4 flex justify-between items-center text-sm">
                                    {item}
                                    <span className="material-symbols-outlined text-emerald-500 opacity-0 group-hover:opacity-100 transition-all">arrow_forward</span>
                                </p>
                                <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
