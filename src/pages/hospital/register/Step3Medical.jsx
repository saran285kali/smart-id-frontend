import { useState, useEffect } from "react";
import { usePatientRegistration } from "../../../context/PatientRegistrationContext";
import hospitalAPI from "../../../services/management.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider";

export default function Step3Medical() {
    const { user } = useAuth();
    const { data, update } = usePatientRegistration();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nfcStatus, setNfcStatus] = useState(data.nfcId ? "Linked" : "Waiting for Tap");

    useEffect(() => {
        // WebSockets removed. Registration linking now requires manual interaction or a dedicated polling API if implemented.
    }, []);

    const simulateTap = () => {
        const mockUid = "REG-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        console.log("Simulating Registration NFC Scan:", mockUid);
        update("nfcId", mockUid);
        setNfcStatus("Linked: " + mockUid);
    };

    const complete = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.target);
            const medicalData = Object.fromEntries(formData.entries());

            const payload = {
                ...data.personal,
                ...data.contact,
                ...medicalData,
                hospitalId: user?.id,
                nfcId: data.nfcId || null,
            };

            if (!payload.nfcId) {
                alert("Please tap an NFC card to link before completing registration.");
                setIsSubmitting(false);
                return;
            }

            console.log("FINAL REGISTRATION PAYLOAD:", payload);

            try {
                const response = await hospitalAPI.registerPatient(payload);
                console.log("Registration success:", response.data);

                // Navigate to success page with data
                navigate("/hospital/register/success", {
                    state: {
                        patientName: response.data.fullName,
                        patientId: response.data.patientId,
                        nfcId: response.data.nfcId || payload.nfcId,
                    }
                });
            } catch (err) {
                console.error("REGISTRATION ERROR FULL:", err);
                alert(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Backend rejected request. Check console for details."
                );
            }
        } catch (err) {
            console.error("Frontend logic error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        navigate("/hospital/register/contact");
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Medical Info & NFC Card</h3>
                <p className="text-sm text-slate-500">Critical medical data and physical card linking.</p>
            </div>

            <form onSubmit={complete} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Blood Group</label>
                        <select
                            name="bloodGroup"
                            defaultValue={data.medical.bloodGroup || "A+"}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            required
                        >
                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>O+</option>
                            <option>O-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Height (cm)</label>
                        <input
                            name="heightCm"
                            type="number"
                            defaultValue={data.medical.heightCm}
                            placeholder="175"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Weight (kg)</label>
                        <input
                            name="weightKg"
                            type="number"
                            defaultValue={data.medical.weightKg}
                            placeholder="70"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Allergies</label>
                    <textarea
                        name="allergies"
                        defaultValue={data.medical.allergies}
                        placeholder="List any known allergies..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px]"
                    />
                </div>

                {/* NFC CARD SECTION */}
                <div 
                    onClick={simulateTap}
                    className="mt-8 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border-2 border-dashed border-emerald-200 dark:border-emerald-800 flex flex-col items-center gap-4 text-center cursor-pointer hover:bg-emerald-100 transition-all"
                >
                    <div className={`size-16 rounded-full flex items-center justify-center transition-all ${data.nfcId ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 animate-pulse"}`}>
                        <span className="material-symbols-outlined text-4xl">contactless</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-emerald-800 dark:text-emerald-400">{nfcStatus}</h4>
                        <p className="text-xs text-emerald-600/70 mt-1 uppercase font-bold tracking-wider">Tap Smart-ID card (or click here to simulate) to link profile</p>
                    </div>
                    {!data.nfcId && (
                        <div className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200 rounded-lg">
                            <div className="size-2 bg-emerald-500 rounded-full animate-ping"></div>
                            Hardware Reader Active
                        </div>
                    )}
                </div>

                <div className="pt-6 flex gap-4">
                    <button
                        type="button"
                        onClick={goBack}
                        className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Registering..." : "Complete Registration"}
                        <span className="material-symbols-outlined">check_circle</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
