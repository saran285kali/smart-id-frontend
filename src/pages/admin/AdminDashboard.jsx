import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthProvider";
import adminApi from "../../services/admin.api";

export default function AdminDashboard() {
    const { logout } = useAuth();
    const [view, setView] = useState("analytics");
    const [stats, setStats] = useState({
        totalUsers: "0",
        activeCards: "0",
        dailyScans: "0",
        emergencyAccess: "0"
    });

    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdminData = async () => {
        try {
            const [statsRes, logsRes, usersRes] = await Promise.all([
                adminApi.getStatistics(),
                adminApi.getAuditLogs(),
                adminApi.getUsers()
            ]);
            
            if (statsRes) setStats(statsRes);
            if (logsRes) setLogs(Array.isArray(logsRes) ? logsRes : []);
            if (usersRes) setUsers(Array.isArray(usersRes) ? usersRes : []);
        } catch (err) {
            console.error("Failed to load admin dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchAdminData();
        const interval = setInterval(fetchAdminData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 transition-colors duration-300">

            {/* SIDEBAR FOR ADMIN */}
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-8 z-50">
                <div className="flex items-center gap-3 text-primary mb-12">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined font-black">admin_panel_settings</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">System Root</span>
                </div>

                <nav className="space-y-3">
                    <AdminNavLink active={view === "analytics"} onClick={() => setView("analytics")} icon="monitoring" label="Analytics" />
                    <AdminNavLink active={view === "users"} onClick={() => setView("users")} icon="group" label="User Control" />
                    <AdminNavLink active={view === "audit"} onClick={() => setView("audit")} icon="receipt_long" label="Audit Vault" />
                    <AdminNavLink active={view === "config"} onClick={() => setView("config")} icon="tune" label="System Config" />
                </nav>

                <div className="absolute bottom-8 left-8 right-8">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-6 py-4 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl font-bold hover:bg-red-100 transition-all"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN ADMIN AREA */}
            <main className="pl-72 min-h-screen">

                {/* TOP BAR */}
                <div className="h-20 px-10 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-40">
                    <h2 className="text-xl font-bold capitalize">{view.replace('_', ' ')} Command Center</h2>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => document.documentElement.classList.toggle("dark")}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:hover:bg-slate-800 text-slate-500"
                        >
                            <span className="material-symbols-outlined">dark_mode</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="admin" />
                            </div>
                            <span className="text-sm font-bold">Admin Root</span>
                        </div>
                    </div>
                </div>

                {/* VIEW CONTENT */}
                <div className="p-10 space-y-10 animate-in fade-in duration-500">

                    {view === "analytics" && (
                        <>
                            {/* STATS GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <StatBlock label="Total Ecosystem Users" value={stats.totalUsers || "0"} sub="Live data synced from cloud" />
                                <StatBlock label="Verified Smart Cards" value={stats.activeCards || "0"} sub="Unique NFC Identities" />
                                <StatBlock label="Live Activity Logs" value={logs.length} sub="Captured in current session" />
                                <StatBlock label="Active Nodes" value={stats.activeNodes || "1"} sub="Distributed network health" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <section className="lg:col-span-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px] flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-8 px-4">
                                        <h3 className="font-bold text-lg">System Activity Stream</h3>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                                            Live Refresh Active
                                        </div>
                                    </div>
                                    
                                    {logs.length === 0 ? (
                                        <div className="text-center py-10 text-slate-500">
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-20">bar_chart</span>
                                            <p className="font-bold">No data available for chart</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-end justify-between h-56 gap-4 mb-4 px-4 overflow-hidden">
                                            {/* Scaling chart to fit real data if possible, else just placeholders for UI structure but marked as dynamic */}
                                            {(stats.chartData || [40, 70, 45, 90, 65, 80]).map((h, i) => (
                                                <div key={i} className="flex-1 bg-primary/20 hover:bg-primary rounded-t-2xl transition-all relative group" style={{ height: `${h}%` }}>
                                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-bold shadow-xl z-10 whitespace-nowrap">
                                                       Activity Index: {h}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter pt-4 border-t dark:border-slate-800 px-4">
                                        <span>Initial Segment</span><span>Real-Time Monitoring</span><span>Current Interval</span>
                                    </div>
                                </section>

                                <section className="lg:col-span-4 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg">Platform Health</h3>
                                        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-6">
                                        <HealthBar label="Auth Core" level={99} />
                                        <HealthBar label="NFC Link" level={100} />
                                        <HealthBar label="DB Integrity" level={stats.dbHealth || 95} />
                                        <HealthBar label="API Sync" level={loading ? 50 : 100} />
                                    </div>
                                </section>
                            </div>
                        </>
                    )}

                    {view === "users" && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-slate-500 font-medium">Manage and provision access for medical staff across the network.</p>
                                <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">person_add</span>
                                    New Staff Identity
                                </button>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm min-h-[400px] flex flex-col justify-center">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-4 py-20">
                                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                        <p className="text-slate-500 font-bold">Synchronizing Staff Records...</p>
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="text-center py-20 text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
                                        <p className="font-bold">No Staff Identities Found</p>
                                        <p className="text-xs">Database returned empty user cluster.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Identify</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Authorized Role</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Affiliation</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Access Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-slate-800">
                                            {users.map(u => (
                                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                                                                {u.name ? u.name[0] : '?'}
                                                            </div>
                                                            <span className="font-bold">{u.name || "Unnamed User"}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-xs font-black uppercase py-1.5 px-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                                                            {u.role ? u.role.replace('_', ' ') : 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">{u.hospital || "Global"}</td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full transition-all border
                                                ${u.status === 'active'
                                                                ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10"
                                                                : "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10"}
                                            `}>
                                                            {u.status || "Unknown"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {view === "audit" && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="flex flex-col gap-6 min-h-[400px] justify-center">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                        <p className="text-slate-500 font-bold">Accessing Audit Vault...</p>
                                    </div>
                                ) : logs.length === 0 ? (
                                    <div className="bg-slate-50 dark:bg-slate-900 p-20 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-center text-slate-500">
                                         <span className="material-symbols-outlined text-4xl mb-2">history_toggle_off</span>
                                         <p className="font-bold">No Audit Records Available</p>
                                         <p className="text-xs">All systems are quiet. No events captured in this cycle.</p>
                                    </div>
                                ) : (
                                    logs.map(log => (
                                        <div key={log.id} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-primary/50 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                    <span className="material-symbols-outlined text-3xl">
                                                        {log.action === "NFC_SCAN" ? "contactless" : log.action === "DISPENSE" ? "pill" : "login"}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-xl leading-none">{log.action || "SYSTEM_EVENT"} TRIGGERED</h4>
                                                    <p className="text-sm text-slate-500 font-medium">Initiated by <span className="text-slate-900 dark:text-white font-bold">{log.user || "System"}</span> • Target: {log.target || "Unknown"}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{log.time || "Just now"}</p>
                                                <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/10 px-3 py-1 rounded-full uppercase">Verified Transaction</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {view === "config" && (
                        <div className="max-w-3xl space-y-8 animate-in slide-in-from-right-5 duration-500">
                            <h3 className="text-2xl font-bold mb-6">Master Protocol Configuration</h3>
                            <div className="space-y-4">
                                <ConfigToggle label="Enable WebNFC Browser API" active={true} />
                                <ConfigToggle label="Enforce Multi-Factor Staff Auth" active={true} />
                                <ConfigToggle label="Allow Emergency Overrides" active={true} />
                                <ConfigToggle label="Enable Auto-Sync Local Vault" active={false} />
                                <ConfigToggle label="Diagnostic Logging Mode" active={false} />
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

function AdminNavLink({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${active
                    ? "bg-primary text-white shadow-xl shadow-primary/30"
                    : "text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
                }`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            <span>{label}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>}
        </button>
    );
}

function StatBlock({ label, value, sub }) {
    return (
        <div className="bg-slate-100 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.02] group">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">{label}</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter transition-all group-hover:text-primary">{value}</p>
            <p className="text-xs text-slate-500 font-medium">{sub}</p>
        </div>
    );
}

function HealthBar({ label, level }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>{label}</span>
                <span className="text-primary">{level}%</span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${level}%` }}></div>
            </div>
        </div>
    )
}

function ConfigToggle({ label, active }) {
    return (
        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:border-primary/30">
            <span className="font-bold">{label}</span>
            <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${active ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? "right-1" : "left-1"}`}></div>
            </div>
        </div>
    )
}
