import { useEffect, useState } from "react";
import { getUsers } from "../../services/adminApi";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers()
            .then(res => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load users:", err);
                // Mock data for UI demo
                setUsers([
                    { name: "Dr. Alexander Pierce", role: "DOCTOR", lastLogin: "2026-02-08 18:30", status: "Active" },
                    { name: "Principal Admin", role: "ADMIN", lastLogin: "2026-02-08 21:45", status: "Active" },
                    { name: "Sarah Connor", role: "MANAGER", lastLogin: "2026-02-07 09:12", status: "Inactive" },
                    { name: "City Pharma Staff", role: "MEDICAL_SHOP", lastLogin: "2026-02-08 14:22", status: "Active" }
                ]);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin size-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-white">User Infrastructure</h2>
                    <p className="text-slate-500 mt-2 font-medium">Monitoring and managing {users.length} active system accounts</p>
                </div>
                <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined">person_add</span>
                    Provision New User
                </button>
            </div>

            <div className="bg-[#0f172a] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-900/50 border-b border-slate-800">
                        <tr>
                            <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Account Name</th>
                            <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Access Role</th>
                            <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Last Session</th>
                            <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users.map((u, i) => (
                            <tr key={i} className="group hover:bg-slate-800/30 transition-colors">
                                <td className="p-6 font-bold text-slate-200">{u.name}</td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tight border ${u.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-6 text-slate-400 font-mono text-xs">{u.lastLogin}</td>
                                <td className="p-6 text-right">
                                    <button className="text-emerald-500 font-black uppercase text-[10px] tracking-widest hover:text-emerald-400 p-2">
                                        Edit Credentials
                                    </button>
                                    <button className="text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-red-500 p-2">
                                        Revoke
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
