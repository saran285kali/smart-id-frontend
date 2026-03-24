import { useState, useEffect } from "react";
import { usePatientRegistration } from "../../../context/PatientRegistrationContext";
import hospitalAPI from "../../../services/management.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthProvider";

export default function Step3Medical() {
    const { user } = useAuth();
    const { data } = usePatientRegistration();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nfcStatus, setNfcStatus] = useState("📡 Ready to link Smart-ID card");

    useEffect(() => {
        setNfcStatus("📡 Ready to link Smart-ID card");
    }, []);

    const complete = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.target);
            const medicalData = Object.fromEntries(formData.entries());

            // 🔥 STEP 1: START HARDWARE PROCESS
            setNfcStatus("👆 Scan fingerprint → then tap NFC card...");

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 25000); // 25 sec timeout

            const res = await fetch("http://192.168.1.5:5001/start-registration", {
                method: "GET",
                signal: controller.signal
            });

            clearTimeout(timeout);

            const deviceData = await res.json();

            // 🔥 ERROR HANDLING
            if (deviceData.error) {
                throw new Error(deviceData.error);
            }

            if (!deviceData.fingerprintId || !deviceData.nfcId) {
                throw new Error("Invalid hardware response");
            }

            // 🔥 SUCCESS UI UPDATE
            setNfcStatus(`✅ Card Linked: ${deviceData.nfcId}`);

            // 🔥 STEP 2: COMBINE ALL DATA
            const payload = {
                ...data.personal,
                ...data.contact,
                ...medicalData,
                hospitalId: user?.id,
                fingerprintId: deviceData.fingerprintId,
                nfcId: deviceData.nfcId
            };

            // 🔥 STEP 3: SEND TO BACKEND
            const response = await hospitalAPI.registerPatient(payload);

            // 🔥 STEP 4: NAVIGATE SUCCESS
            navigate("/hospital/register/success", {
                state: {
                    patientName:
                        response.data.fullName ||
                        `${data.personal.firstName} ${data.personal.lastName}`,
                    patientId: response.data.patientId,
                    nfcId: response.data.nfcId || payload.nfcId
                }
            });

        } catch (err) {
            console.error(err);

            if (err.name === "AbortError") {
                alert("⏳ Timeout: Please scan faster and try again");
            } else {
                alert("❌ " + err.message);
            }

            setNfcStatus("❌ Failed. Try again.");
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
                <h3 className="text-xl font-bold text-white mb-1">
                    Medical Info & Smart-ID Card
                </h3>
                <p className="text-sm text-gray-400">
                    Add medical details and link fingerprint + NFC card.
                </p>
            </div>

            <form onSubmit={complete} className="space-y-4">

                {/* MEDICAL INPUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="text-xs text-gray-400">Blood Group</label>
                        <select
                            name="bloodGroup"
                            defaultValue={data.medical.bloodGroup || "A+"}
                            className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700"
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

                {/* 🔥 HARDWARE STATUS UI */}
                <div className="mt-8 p-6 rounded-2xl bg-gray-900 border-2 border-dashed border-emerald-500 text-center">
                    <div className="flex flex-col items-center gap-4">

                        <div className="size-16 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined text-4xl">
                                contactless
                            </span>
                        </div>

                        <h4 className="font-bold text-emerald-400">
                            {nfcStatus}
                        </h4>

                        <p className="text-xs text-gray-500 uppercase">
                            Fingerprint → NFC → Auto Link
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
                        {isSubmitting ? "Processing Hardware..." : "Complete Registration"}
                    </button>

                </div>

            </form>
        </div>
    );
}