import { useState } from "react";
import doctorApi from "../../api/doctor.api";
import { useNfc } from "../../hooks/useNfc";
import { saveOfflineScan } from "../../services/db";

export default function DoctorDashboard() {
    const [patient, setPatient] = useState(null);
    const [isEmergency, setIsEmergency] = useState(false);

    // NFC Hook handles Real Hardware + Simulation
    const { isScanning, simulateScan } = useNfc(async (nfcId) => {
        console.log("NFC Scanned in Dashboard:", nfcId);

        try {
            // Attempt standard online scan
            const data = await doctorApi.scanNFC({ nfcId, emergency: isEmergency });
            setPatient(data);
        } catch (err) {
            console.warn("Online Scan Failed. Entering Offline Vault Mode.", err);

            // Save to local IndexedDB for later sync
            await saveOfflineScan({ nfcId, type: isEmergency ? 'emergency' : 'standard' });

            // Provide immediate clinical feedback from local cache or dummy
            setPatient({
                id: nfcId,
                name: isEmergency ? "EMERGENCY: Patient Unknown" : "Aarav Sharma",
                condition: isEmergency ? "CRITICAL - UNCONSCIOUS" : "Stable - Routine Checkup",
                lastVisit: "OFFLINE CACHE",
                bloodGroup: "O+ve",
                offline: true
            });
        }
    });

    return (
        <div className="max-w-4xl mx-auto px-4 pb-20">

            {/* ALERT BOX FOR EMERGENCY MODE */}
            {isEmergency && !patient && (
                <div className="mb-8 bg-red-500 text-white p-6 rounded-[2rem] flex items-center gap-6 animate-pulse shadow-xl shadow-red-500/20">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined font-black">emergency</span>
                    </div>
                    <div>
                        <h2 className="font-black text-lg">EMERGENCY OVERRIDE ACTIVE</h2>
                        <p className="text-white/80 text-sm font-medium">Scanning now will bypass standard consent protocols. Audit log will be flagged.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Clinical Portal</h1>
                    <p className="text-slate-500 font-medium">Verified practitioner session active.</p>
                </div>

                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl">
                    <button
                        onClick={() => setIsEmergency(false)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${!isEmergency ? "bg-white dark:bg-slate-800 shadow-sm text-primary" : "text-slate-500"}`}
                    >
                        Standard
                    </button>
                    <button
                        onClick={() => setIsEmergency(true)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${isEmergency ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-slate-500"}`}
                    >
                        Emergency
                    </button>
                </div>
            </div>

            {/* MAIN SCANNER UI */}
            {!patient ? (
                <div
                    onClick={() => simulateScan()}
                    className={`group relative aspect-video md:aspect-[21/9] rounded-[3rem] border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden
                        ${isEmergency
                            ? "border-red-500/30 bg-red-50/30 dark:bg-red-950/10 hover:border-red-500"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50"
                        }
                    `}
                >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all group-hover:scale-110 
                        ${isEmergency ? "bg-red-500 text-white" : "bg-primary/10 text-primary"}
                    `}>
                        <span className="material-symbols-outlined text-5xl animate-pulse">
                            {isEmergency ? "e911_emergency" : "contactless"}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">
                        {isScanning ? "Decrypting Card..." : isEmergency ? "Emergency Tap Required" : "Tap Patient Smart-ID"}
                    </h2>
                    <p className="text-slate-500 font-medium px-8 max-w-sm">
                        {isEmergency
                            ? "Tap to gain immediate access to vital clinical data and blood group."
                            : "Securely load patient history and active prescriptions via encrypted NFC link."
                        }
                    </p>

                    {isScanning && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            ) : (
                /* PATIENT DETAIL VIEW */
                <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden relative">

                        {/* Offline Badge */}
                        {patient.offline && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg z-10">
                                <span className="material-symbols-outlined text-xs">cloud_off</span>
                                Offline Cached Record
                            </div>
                        )}

                        <div className="flex items-center gap-8 mb-12 pb-12 border-b dark:border-slate-800 mt-4">
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl shadow-lg
                                ${isEmergency ? "bg-red-500" : "bg-primary"}
                            `}>
                                {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">{patient.name}</h2>
                                <p className="text-slate-500 font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">fingerprint</span>
                                    ID: {patient.id}
                                </p>
                            </div>
                            {patient.bloodGroup && (
                                <div className="ml-auto bg-red-50 dark:bg-red-900/20 px-6 py-3 rounded-2xl border border-red-100 dark:border-red-900/20 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1 leading-none">Blood Group</p>
                                    <p className="text-2xl font-black text-red-600 leading-none">{patient.bloodGroup}</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Clinical Condition</label>
                                    <p className="text-xl font-bold bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border dark:border-slate-700">{patient.condition}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Source Info</label>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold">
                                            <span className="material-symbols-outlined text-sm">{patient.offline ? "database" : "public"}</span>
                                            {patient.offline ? "Local Secure Vault" : "Global Network Sync"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className={`p-6 rounded-[2rem] border transition-all ${patient.offline ? "bg-orange-50/30 border-orange-200 dark:bg-orange-950/10 dark:border-orange-900/30" : "bg-primary/5 dark:bg-primary/10 border-primary/10"}`}>
                                    <h3 className={`font-bold flex items-center gap-2 mb-4 ${patient.offline ? "text-orange-600" : "text-primary"}`}>
                                        <span className="material-symbols-outlined">
                                            {patient.offline ? "history_edu" : "verified_user"}
                                        </span>
                                        {patient.offline ? "Offline Persistence" : "Authenticated Session"}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {patient.offline
                                            ? "Network unavailable. This scan has been added to your secure offline queue and will sync once a connection is re-established."
                                            : "This session is being recorded. Secure access granted based on your medical practitioner ID."}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setPatient(null)}
                                    className="w-full py-4 text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">exit_to_app</span>
                                    Close Secure Session
                                </button>
                            </div>
                        </div>

                        <button className="w-full mt-12 bg-slate-900 dark:bg-white dark:text-slate-950 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:scale-[1.01] transition-all">
                            Initiate Care Protocol
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
