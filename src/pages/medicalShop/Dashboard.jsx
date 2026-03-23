import { useState, useEffect } from "react";
import medicalShopApi from "../../services/medicalShop.api";
import adminApi from "../../services/admin.api";
import doctorApi from "../../services/doctor.api";

export default function MedicalShopDashboard() {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nfcId, setNfcId] = useState(null);

    // Continuous polling for NFC hardware taps
    useEffect(() => {
        const interval = setInterval(() => {
            if (patient) return; // Stop polling if we already have a patient session

            adminApi.getLatestNfc()
                .then(data => {
                    if (data && data.nfcId && data.nfcId !== nfcId) {
                        setNfcId(data.nfcId);
                        handleAutoFetch(data.nfcId);
                    }
                })
                .catch(err => console.error("NFC Hardware Poll Failed:", err));
        }, 2000);

        return () => clearInterval(interval);
    }, [patient, nfcId]);

    const handleAutoFetch = async (id) => {
        setLoading(true);
        try {
            // First fetch patient by the hardware ID
            const data = await doctorApi.getPatientByUid(id);
            if (data && data.patient) {
                setPatient({
                    ...data.patient,
                    name: data.patient.fullName || data.patient.name || "Unknown Patient",
                    prescriptions: data.patient.prescriptions || []
                });
            }
        } catch (err) {
            console.error("Auto-fetch error:", err);
            // Optionally reset nfcId to allow re-tap if it fails
            setNfcId(null);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPDF = (id) => {
        window.open(
            `/medical-shop/prescription/${id}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const resetSession = () => {
        setPatient(null);
        setNfcId(null);
    };

    return (
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-light text-slate-900 dark:text-white mb-3">
                    Welcome back, <span className="font-bold">Pharmacist</span>
                </h1>
                <p className="text-slate-500 font-medium">
                    Securely verify prescriptions by tapping the patient's Smart ID.
                </p>
            </div>

            {/* REAL NFC MONITORING SURFACE */}
            {!patient && (
                <div
                    className="group relative mx-auto max-w-sm aspect-square bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl shadow-primary/5 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center overflow-hidden"
                >
                    {/* Decorative background pulse */}
                    <div className="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full"></div>

                    <div className="relative w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                        <span className={`material-symbols-outlined text-primary text-6xl ${!loading ? 'animate-pulse' : ''}`}>
                            contactless
                        </span>
                    </div>

                    <h2 className="relative text-2xl font-bold text-slate-900 dark:text-white">
                        {nfcId ? "✅ Card Linked" : "📡 Waiting for Tap..."}
                    </h2>
                    <p className="relative text-slate-500 mt-2 font-medium">
                        {nfcId ? `ID: ${nfcId}` : "Place patient card on the NFC reader"}
                    </p>

                    {loading && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <span className="font-bold text-primary animate-pulse">Fetching Patient EMR...</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* PATIENT PRESCRIPTION VIEW (HIPAA LIMITED) */}
            {patient && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl">
                        <div className="bg-primary p-8 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl">patient_list</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold leading-tight">{patient.name}</h2>
                                    <span className="text-white/80 text-sm font-medium">Verified Patient Session</span>
                                </div>
                            </div>
                            <button
                                onClick={resetSession}
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Patient Age</label>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{patient.age || "N/A"} Years</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Gender</label>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{patient.gender || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Contact</label>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{patient.phone || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Status</label>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-500 rounded-full text-xs font-bold">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        Active Prescription
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary">prescriptions</span>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Active Prescriptions</h4>
                                </div>

                                <div className="space-y-3">
                                    {(patient.prescriptions && patient.prescriptions.length > 0) ? patient.prescriptions.map((p, i) => (
                                        <div key={i} className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-primary/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-xl">pill</span>
                                                </div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{p.name || p}</span>
                                            </div>

                                            <button
                                                onClick={() => handleViewPDF(p.id || i)}
                                                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                <span className="material-symbols-outlined !text-sm">open_in_new</span>
                                                VIEW PDF
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="text-center py-10 text-slate-400">
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-20">block</span>
                                            <p className="text-xs font-bold uppercase tracking-widest">No Active Prescriptions Found</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all">
                                        Mark as Dispensed
                                    </button>
                                    <button className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-bold flex items-center justify-center">
                                        <span className="material-symbols-outlined">print</span>
                                    </button>
                                </div>
                            </div>

                            <p className="mt-6 text-center text-xs text-slate-400 font-medium">
                                🔒 Privacy Guard: Diagnosis and medical history are hidden from this view.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
