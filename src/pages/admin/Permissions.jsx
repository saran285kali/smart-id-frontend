import { useState, useEffect } from "react";
import adminApi from "../../services/admin.api";
import PermissionConfirmModal from "../../components/admin/PermissionConfirmModal";

export default function Permissions() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [permissions, setPermissions] = useState({});
    const [pendingChanges, setPendingChanges] = useState(0);

    useEffect(() => {
        adminApi.getPermissions()
            .then(data => {
                if (data) setPermissions(data);
            })
            .catch(err => console.error("Could not fetch security matrix:", err));
    }, []);

    const togglePermission = (role, key) => {
        setPermissions(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [key]: !prev[role]?.[key]
            }
        }));
        setPendingChanges(prev => prev + 1);
    };

    const roles = ['DOCTOR', 'HOSPITAL', 'PATIENT', 'MEDICAL_SHOP'];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            <div>
                <h2 className="text-4xl font-black tracking-tight text-white">Security Matrix</h2>
                <p className="text-slate-500 mt-2 font-medium">Define fine-grained access protocols for system roles</p>
            </div>

            <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-10 shadow-2xl">
                <div className="flex items-start gap-4 mb-8">
                    <div className="size-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                        <span className="material-symbols-outlined">rule_settings</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-200">Global Permissions Overlay</h3>
                        <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-bold text-[10px]">Changes here affect all active session tokens</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roles.map((role) => (
                        <div key={role} className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group">
                            <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 mb-4">{role}</p>
                            <div className="space-y-3">
                                {[
                                    { key: 'emrWrite', label: 'EMR Write' },
                                    { key: 'identityView', label: 'Identity View' },
                                    { key: 'emergencyBypass', label: 'Emergency Bypass' }
                                ].map((p) => (
                                    <div 
                                        key={p.key} 
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => togglePermission(role, p.key)}
                                    >
                                        <span className="text-xs font-bold text-slate-300">{p.label}</span>
                                        <div className={`w-8 h-4 rounded-full transition-all ${permissions[role]?.[p.key] ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 h-64 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50 group hover:border-emerald-500/20 transition-all">
                    <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">analytics</span>
                    <p className="font-bold text-sm">Interactive Permissions Hierachy View</p>
                    <p className="text-[10px] opacity-60">Visual interface for node-based logic</p>
                </div>
            </div>

            <div className="fixed bottom-10 left-80 right-10 bg-[#0f172a]/80 backdrop-blur-xl border border-slate-700 p-6 rounded-[2.5rem] flex justify-between items-center shadow-2xl animate-in slide-in-from-bottom-10 duration-1000">
                <div className="flex items-center gap-4">
                    <div className="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                        <span className="material-symbols-outlined">pending_actions</span>
                    </div>
                    <div>
                        <span className="text-slate-300 font-bold block">{pendingChanges > 0 ? "Policy Update Pending" : "Policy Synced"}</span>
                        <span className="text-xs text-slate-500 font-medium">{pendingChanges} modifications to role-based access tokens</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => { setPendingChanges(0); window.location.reload(); }}
                        className="px-6 py-3 text-slate-400 font-bold hover:text-white transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-8 py-3 rounded-2xl font-black tracking-tight shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                    >
                        Commit Changes
                    </button>
                </div>
            </div>

            {showConfirm && (
                <PermissionConfirmModal onClose={() => setShowConfirm(false)} />
            )}
        </div>
    );
}
