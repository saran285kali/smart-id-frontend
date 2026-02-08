import { useEffect, useState } from "react";
import { getPatientEMR } from "../../services/patientApi";

export default function Dashboard() {
    const [emr, setEmr] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPatientEMR()
            .then(res => {
                setEmr(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load EMR:", err);
                // Mock data for UI demo
                setEmr({
                    visits: [
                        { hospital: "City General Hospital", doctor: "Dr. Sarah Smith", date: "2026-02-05", summary: "Regular checkup - normal results.", category: "Routine" },
                        { hospital: "St. Mary's Clinic", doctor: "Dr. James Wilson", date: "2026-01-20", summary: "Persistent cough - prescribed antibiotics.", category: "Illness" }
                    ]
                });
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin size-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-emerald-50">Medical History</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-900/40 rounded-xl text-sm font-bold text-slate-600 dark:text-emerald-200/60 hover:bg-slate-50 transition-all">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Export PDF
                </button>
            </div>

            <div className="grid gap-6">
                {emr?.visits?.map((visit, idx) => (
                    <div key={idx} className="group p-6 bg-white dark:bg-[#11221f] rounded-2xl border border-slate-200 dark:border-emerald-900/30 hover:border-emerald-500/50 transition-all shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-emerald-50">{visit.hospital}</h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-emerald-200/40">
                                    {visit.doctor} • {new Date(visit.date).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${visit.category === 'Illness' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                {visit.category || 'Visit'}
                            </span>
                        </div>
                        <p className="text-slate-600 dark:text-emerald-100/80 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
                            {visit.summary}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
