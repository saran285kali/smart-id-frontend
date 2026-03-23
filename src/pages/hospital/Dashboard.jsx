import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import hospitalAPI from '../../services/management.api';

export default function HospitalDashboard() {
    const navigate = useNavigate();
    const { patient, setPatient, resetSession } = useSession();
    const [hardwareStatus, setHardwareStatus] = useState({});

    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchHardware = async () => {
            try {
                const res = await hospitalAPI.getStats(); // Currently mapped to /stats
                const data = res.data || res;
                setStats(data);
                
                setHardwareStatus({
                    nfc: data.hardware?.nfc || "online",
                    gsm: data.hardware?.gsm || "online",
                    raspberrypi: data.hardware?.pi || "online"
                });
            } catch (err) {
                console.error("Failed to fetch hospital telemetry:", err);
            }
        };
        fetchHardware();
        const interval = setInterval(fetchHardware, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-full">

            {/* HEADER SECTION */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Hospital Overview</h1>
                <p className="text-slate-500 mt-2">Operational dashboard and NFC access control.</p>
            </div>

            {/* NFC STATUS & ACTIVE SESSION */}
            <section className="bg-white dark:bg-[#1a2e2a] rounded-2xl p-8 border border-slate-200 dark:border-emerald-900/30 shadow-sm transition-all">
                {!patient ? (
                    <div className="text-center">
                        <div className="mx-auto size-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-4xl animate-pulse">
                                contactless
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-emerald-50">
                            NFC Status: Active / Waiting
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-emerald-200/60 max-w-md mx-auto">
                            System is ready to receive hardware-registered patients. Polling active.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-6">
                            <div className="size-20 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/20">
                                <span className="material-symbols-outlined text-4xl">person</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{patient.name}</h3>
                                <div className="flex gap-4 mt-1">
                                    <span className="text-sm text-slate-500 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">fingerprint</span>
                                        {patient.id}
                                    </span>
                                    <span className="text-sm text-slate-500 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        {patient.location || "General Ward"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate("/hospital/clinical-note/auth")}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">edit_note</span>
                                Add Clinical Note
                            </button>
                            <button
                                onClick={() => navigate("/hospital/emergency/confirm")}
                                disabled={!patient}
                                className="px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 transition-all flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
                            >
                                <span className="material-symbols-outlined">emergency</span>
                                Emergency Override
                            </button>
                            <button
                                onClick={resetSession}
                                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                End Session
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* SUMMARY CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Stat label="Daily Admissions" value={stats?.dailyAdmissions || "0"} delta={stats?.admissionsDelta} icon="login" color="blue" />
                <Stat label="ER Load" value={stats?.erLoad || "0%"} status={stats?.erStatus || "Standard"} icon="emergency" color="red" />
                <Stat label="Available Rooms" value={stats?.availableRooms || "0"} icon="bed" color="emerald" />
                <Stat label="Staff on Duty" value={stats?.staffCount || "0"} delta={stats?.staffDelta} icon="medical_services" color="purple" />
            </section>

            {/* CHART + SYSTEM HEALTH */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PatientFlowChart stats={stats} />
                </div>
                <SystemHealth hardwareStatus={hardwareStatus} />
            </section>

        </div>
    );
}

function Stat({ label, value, delta, status, icon, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
        red: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
        emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
        purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400"
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`size-12 rounded-xl flex items-center justify-center ${colors[color] || colors.blue}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                {delta && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${delta.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                        {delta}
                    </span>
                )}
                {status && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full text-orange-600 bg-orange-50">
                        {status}
                    </span>
                )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</h4>
        </div>
    );
}

function PatientFlowChart({ stats }) {
    const chartData = stats?.chartData || [45, 60, 40, 75, 50, 85, 65];
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-[400px] flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 dark:text-white">Patient Flow Trend</h3>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    Live Telemetry
                </div>
            </div>
            <div className="flex-1 flex items-end gap-2 px-2">
                {chartData.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div
                            style={{ height: `${h}%` }}
                            className="w-full bg-emerald-500/20 group-hover:bg-emerald-500/40 rounded-t-lg transition-all relative"
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Value: {h}
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">PT-{i + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SystemHealth({ hardwareStatus }) {
    const services = [
        { name: "NFC Gateway", status: hardwareStatus?.nfc === "connected" ? "Online" : "Offline", latency: "12ms" },
        { name: "Database", status: "Online", latency: "45ms" },
        { name: "GSM Module", status: hardwareStatus?.gsm === "online" ? "Online" : "Offline", latency: "22ms" },
        { name: "Raspberry Pi", status: hardwareStatus?.raspberrypi === "online" ? "Active" : "Offline", latency: "---" }
    ];

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Service Health</h3>
            <div className="space-y-4">
                {services.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className={`size-2 rounded-full ${s.status === 'Online' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`}></div>
                            <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{s.name}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">{s.status}</p>
                            </div>
                        </div>
                        <span className="text-xs font-mono text-slate-400">{s.latency}</span>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all text-sm font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">settings</span>
                System Settings
            </button>
        </div>
    );
}
