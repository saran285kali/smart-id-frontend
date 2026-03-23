import { useEffect, useState } from "react";
import adminApi from "../../services/admin.api";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", phone: "" });
    const [nfcId, setNfcId] = useState(null);

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

    const fetchLatestNfc = () => {
        adminApi.getLatestNfc()
            .then(data => {
                if (data && data.nfcId) {
                    setNfcId(data.nfcId);
                }
            })
            .catch(err => console.error("NFC Poll Error:", err));
    };

    useEffect(() => {
        fetchUsers();
        // Polling loop for users and NFC data
        const usersInterval = setInterval(fetchUsers, 5000);
        const nfcInterval = setInterval(fetchLatestNfc, 2000);
        
        return () => {
            clearInterval(usersInterval);
            clearInterval(nfcInterval);
        };
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        if(!nfcId) {
            alert("Please tap a physical NFC card first to link the identity.");
            return;
        }
        try {
            await adminApi.createUser({ 
                ...formData, 
                role: 'PATIENT',
                nfcUuid: nfcId 
            });
            setFormData({ name: "", phone: "" });
            setNfcId(null);
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
                    <h2 className="text-4xl font-black tracking-tight text-white">Smart-ID Network</h2>
                    <p className="text-slate-500 mt-2 font-medium">Monitoring {users.length} active system identities</p>
                </div>
                <div className="flex gap-4">
                    <div className={`px-6 py-3 font-bold rounded-xl transition-all border flex items-center gap-2 ${nfcId ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-amber-500/10 border-amber-500/50 text-amber-500'}`}>
                        <span className="material-symbols-outlined">{nfcId ? 'verified' : 'contactless'}</span>
                        {nfcId ? `✅ Linked: ${nfcId}` : '📡 Waiting for NFC tap...'}
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        Provision Patient
                    </button>
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleRegister} className="bg-[#0f172a] p-8 rounded-3xl border border-slate-800 space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Full Legal Name</label>
                             <input 
                                className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-emerald-500 transition-all"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Registered Phone</label>
                             <input 
                                className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-emerald-500 transition-all"
                                placeholder="+91 00000 00000"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900/50 border border-dashed border-slate-700 rounded-2xl flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-400">Target NFC Identity:</span>
                         <span className={`text-sm font-black ${nfcId ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {nfcId || "Awaiting Physical Tap..."}
                         </span>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-slate-400 font-bold hover:text-white transition-colors">Discard</button>
                        <button type="submit" disabled={!nfcId} className="px-8 py-2 bg-emerald-600 text-white font-black rounded-xl disabled:opacity-50 disabled:grayscale">Link & Register</button>
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
                                            <div>
                                                <p>{u.name}</p>
                                                <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{u.nfcUuid || "No Card Linked"}</p>
                                            </div>
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
