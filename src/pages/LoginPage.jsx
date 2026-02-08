import { useState } from "react"
import { useAuth } from "../auth/useAuth"
import api from "../services/api"
import patientApi from "../api/patient.api"

function LoginPage() {
    const { login } = useAuth()
    const [activeTab, setActiveTab] = useState("patient")
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)

    // Patient Logic
    const [patientAuth, setPatientAuth] = useState({
        phone: "",
        otp: ""
    })

    // Hospital Logic
    const [hospitalLogin, setHospitalLogin] = useState({
        username: "",
        password: "",
        role: ""
    })

    const handleSendOtp = async () => {
        if (!patientAuth.phone) return alert("Enter mobile number")
        setLoading(true)
        try {
            await patientApi.sendOtp(patientAuth.phone)
            setOtpSent(true)
        } catch (err) {
            console.error(err)
            // For demo: pretend it worked
            setOtpSent(true)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e) => {
        e?.preventDefault()
        if (!patientAuth.otp) return alert("Enter OTP")
        setLoading(true)
        try {
            const res = await patientApi.verifyOtp(patientAuth.phone, patientAuth.otp)
            login(res.data.token)
        } catch (err) {
            console.error(err)
            alert("Invalid OTP")
        } finally {
            setLoading(false)
        }
    }

    const handleHospitalLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post("/auth/login", hospitalLogin)
            login(res.data.token)
        } catch (err) {
            alert(err.response?.data?.message || "Login failed")
        }
    }

    return (
        <div className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-3xl font-bold">local_hospital</span>
                    <span className="font-bold text-xl tracking-tight">MediPortal</span>
                </div>
                <button
                    onClick={() => document.documentElement.classList.toggle("dark")}
                    className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                    <span className="material-symbols-outlined">dark_mode</span>
                </button>
            </header>

            {/* MAIN */}
            <main className="min-h-screen flex items-center justify-center pt-24 px-4 overflow-hidden">
                <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden min-h-[700px] border dark:border-slate-800">

                    {/* LEFT PANEL */}
                    <div className="w-full md:w-1/2 p-10 lg:p-16 flex items-center">
                        <div className="w-full max-w-md mx-auto">
                            <h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome Back</h1>
                            <p className="text-slate-500 mb-10 font-medium">Access your global health ID securely.</p>

                            {/* TABS */}
                            <div className="flex gap-10 mb-12 border-b dark:border-slate-800">
                                <button
                                    onClick={() => setActiveTab("hospital")}
                                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === "hospital" ? "text-primary border-b-2 border-primary" : "text-slate-400"}`}
                                >
                                    Hospital Domain
                                </button>
                                <button
                                    onClick={() => setActiveTab("patient")}
                                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === "patient" ? "text-primary border-b-2 border-primary" : "text-slate-400"}`}
                                >
                                    Patient Domain
                                </button>
                            </div>

                            {/* PATIENT DOMAIN */}
                            {activeTab === "patient" && (
                                <form className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500" onSubmit={handleVerifyOtp}>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-2 block">Mobile Number</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">phone_iphone</span>
                                            <input
                                                type="tel"
                                                placeholder="Enter mobile number"
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none border focus:border-primary/50 transition-all font-medium"
                                                value={patientAuth.phone}
                                                onChange={(e) => setPatientAuth({ ...patientAuth, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {otpSent && (
                                        <div className="animate-in zoom-in-95 duration-300">
                                            <label className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-2 block">One Time Password</label>
                                            <input
                                                type="text"
                                                placeholder="Check your SMS"
                                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none border focus:border-primary/50 transition-all font-bold tracking-[0.5em] text-center"
                                                value={patientAuth.otp}
                                                onChange={(e) => setPatientAuth({ ...patientAuth, otp: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {!otpSent ? (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                                        >
                                            {loading ? "Sending..." : "Request Access Code"}
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all"
                                        >
                                            Verify & Enter
                                        </button>
                                    )}

                                    {otpSent && (
                                        <p className="text-center text-xs font-medium text-slate-500">
                                            Didn't get code? <button type="button" onClick={handleSendOtp} className="text-primary font-bold">Resend</button>
                                        </p>
                                    )}
                                </form>
                            )}

                            {/* HOSPITAL DOMAIN */}
                            {activeTab === "hospital" && (
                                <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleHospitalLogin}>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-2 block">ID / Username</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none border focus:border-primary/50 transition-all font-medium"
                                            placeholder="Enter ID"
                                            value={hospitalLogin.username}
                                            onChange={(e) => setHospitalLogin({ ...hospitalLogin, username: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-2 block">Security Token / Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none border focus:border-primary/50 transition-all font-medium"
                                            placeholder="••••••••"
                                            value={hospitalLogin.password}
                                            onChange={(e) => setHospitalLogin({ ...hospitalLogin, password: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-2 block">Authorized Role</label>
                                        <select
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 outline-none border focus:border-primary/50 transition-all font-bold cursor-pointer appearance-none"
                                            value={hospitalLogin.role}
                                            onChange={(e) => setHospitalLogin({ ...hospitalLogin, role: e.target.value })}
                                        >
                                            <option value="">Select Domain Access</option>
                                            <option value="doctor">Medical Doctor</option>
                                            <option value="hospital">Hospital Admin</option>
                                            <option value="medical_shop">Pharmacist</option>
                                            <option value="admin">System Root</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-slate-900 dark:bg-white dark:text-slate-950 text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
                                        disabled={!hospitalLogin.role}
                                    >
                                        Authenticate Staff
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL - DYNAMIC */}
                    <div className="hidden md:flex w-1/2 bg-primary items-center justify-center text-white p-16 relative">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-40 -mb-40"></div>

                        <div className="text-center max-w-sm relative z-10">
                            <div className="w-20 h-20 bg-white/10 rounded-3xl mx-auto mb-8 flex items-center justify-center backdrop-blur-md">
                                <span className="material-symbols-outlined text-4xl">
                                    {activeTab === "hospital" ? "shield_locked" : "patient_list"}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold mb-4 tracking-tight">
                                {activeTab === "hospital" ? "Secure Hospital Network" : "Your Health, Unified"}
                            </h2>
                            <p className="text-white/70 font-medium leading-relaxed">
                                {activeTab === "hospital"
                                    ? "Access protocol for verified medical professionals and administrators using E2E encryption."
                                    : "Access your global unified medical records, prescriptions, and health history instantly using secure OTP."}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LoginPage
