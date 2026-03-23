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
    const [nfcStatus, setNfcStatus] = useState("📡 Waiting for NFC tap...");

    // ✅ FETCH REAL NFC FROM BACKEND
    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`${import.meta.env.VITE_API_URL}/api/nfc`)
                .then(res => res.json())
                .then(res => {
                    if (res.nfcId) {
                        update("nfcId", res.nfcId);
                        setNfcStatus(`✅ Linked: ${res.nfcId}`);
                    }
                })
                .catch(err => console.log("NFC fetch error:", err));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

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
                alert("Please tap an NFC card before completing registration.");
                setIsSubmitting(false);
                return;
            }

            const response = await hospitalAPI.registerPatient(payload);

            navigate("/hospital/register/success", {
                state: {
                    patientName: response.data.fullName,
                    patientId: response.data.patientId,
                    nfcId: response.data.nfcId || payload.nfcId,
                }
            });

        } catch (err) {
            console.error(err);
            alert("Registration failed");
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
                <h3 className="text-xl font-bold text-white mb-1">Medical Info & NFC Card</h3>
                <p className="text-sm text-gray-400">Critical medical data and physical card linking.</p>
            </div>

            <form onSubmit={complete} className="space-y-4">

                {/* 🔥 FIXED INPUT STYLES (VISIBLE TEXT) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="text-xs text-gray-400">Blood Group</label>
                        <select
                            name="bloodGroup"
                            defaultValue={data.medical.bloodGroup || "A+"}
                            className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-emerald-500"
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

                    <div>
                        <label className="text-xs text-gray-400">Height (cm)</label>
                        <input
                            name="heightCm"
                            type="number"
                            defaultValue={data.medical.heightCm}
                            className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700"
                        />
                    </div>

                </div>

                <div>
                    <label className="text-xs text-gray-400">Weight (kg)</label>
                    <input
                        name="weightKg"
                        type="number"
                        defaultValue={data.medical.weightKg}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700"
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-400">Allergies</label>
                    <textarea
                        name="allergies"
                        defaultValue={data.medical.allergies}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 min-h-[100px]"
                    />
                </div>

                {/* ✅ REAL NFC SECTION */}
                <div className="mt-8 p-6 rounded-2xl bg-gray-900 border-2 border-dashed border-emerald-500 text-center">

                    <div className="flex flex-col items-center gap-4">

                        <div className="size-16 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined text-4xl">contactless</span>
                        </div>

                        <h4 className="font-bold text-emerald-400">
                            {data.nfcId ? `✅ Linked: ${data.nfcId}` : nfcStatus}
                        </h4>

                        <p className="text-xs text-gray-500 uppercase">
                            Tap Smart-ID card to link profile
                        </p>

                    </div>
                </div>

                {/* BUTTONS */}
                <div className="pt-6 flex gap-4">

                    <button
                        type="button"
                        onClick={goBack}
                        className="px-6 py-4 bg-gray-800 text-gray-300 rounded-2xl"
                    >
                        Back
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl"
                    >
                        {isSubmitting ? "Registering..." : "Complete Registration"}
                    </button>

                </div>

            </form>
        </div>
    );
}