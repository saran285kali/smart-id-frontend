import { useEffect, useState } from "react";
import adminApi from "../../services/admin.api";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", phone: "" });
    const [isHardwareMode, setIsHardwareMode] = useState(false);

    const fetchUsers = () => {
        adminApi.getUsers()
            .then(res => {
                setUsers(Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []));
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load users:", err);
                setUsers([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
        // Polling for real-time updates / Hardware Mode
        const interval = setInterval(fetchUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await adminApi.createUser({ ...formData, role: 'PATIENT' });
            setFormData({ name: "", phone: "" });
            setShowForm(false);
            fetchUsers();
        } catch (err) {
            alert("Registration failed. Please check connection.");
        }
    };

    if (loading && users.length === 0) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin size-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-white">Smart-ID Infrastructure</h2>
                    <p className="text-slate-500 mt-2 font-medium">Monitoring {users.length} active system identities</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsHardwareMode(!isHardwareMode)}
                        className={`px-6 py-3 font-bold rounded-xl transition-all flex items-center gap-2 ${isHardwareMode ? 'bg-amber-600 text-white shadow-amber-600/20' : 'bg-slate-800 text-slate-400'}`}
                    >
                        <span className="material-symbols-outlined">{isHardwareMode ? 'contactless' : 'sensors_off'}</span>
                        {isHardwareMode ? 'Hardware Mode: Waiting' : 'Manual Mode'}
                    </button>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        Provision New User
                    </button>
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleRegister} className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 space-y-4 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-emerald-500 transition-all"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                        <input 
                            className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-emerald-500 transition-all"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-slate-400 font-bold">Cancel</button>
                        <button type="submit" className="px-8 py-2 bg-emerald-600 text-white font-black rounded-xl">Register Patient</button>
                    </div>
                </form>
            )}

            <div className="bg-[#0f172a] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-900/50 border-b border-slate-800">
                        <tr>
                            <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Identified Entity</th>
                            <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Access Role</th>
                            <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Security Status</th>
                            <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-20 text-center text-slate-500">
                                    <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
                                    <p className="font-bold">No registered accounts available.</p>
                                    <p className="text-xs uppercase tracking-widest mt-1">Connect backend or register new patient above.</p>
                                </td>
                            </tr>
                        ) : (
                            users.map((u, i) => (
                                <tr key={u.id || i} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="p-6 font-bold text-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px]">
                                                {u.name?.[0] || "?"}
                                            </div>
                                            {u.name}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tight border ${u.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {u.role || 'PATIENT'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`size-1.5 rounded-full ${u.status === 'active' || u.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                                            <span className="text-slate-400 font-mono text-xs capitalize">{u.status || 'Verified'}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="text-emerald-500 font-black uppercase text-[10px] tracking-widest hover:underline p-2">
                                            Vault
                                        </button>
                                        <button className="text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-red-500 p-2">
                                            Revoke
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
