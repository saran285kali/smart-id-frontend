import api from "../services/api";

const hospitalAPI = {
    registerPatient: (payload) => api.post("/auth/register", payload),

    // Patient Session & NFC
    getPatientByNfc: (nfcId) => api.get(`/nfc/patient/${nfcId}`),

    // OTP Consent flow
    sendOtp: (phone) => api.post("/otp/send-otp", { phone }),
    verifyOtp: (payload) => api.post("/otp/verify-otp", payload),
    resendOtp: (phone) => api.post("/otp/send-otp", { phone }),
    // sendNomineeOtp: (patientId) => api.post("/hospital/otp/send-nominee", { patientId }), // No backend match yet

    // Biometric Verification
    verifyBiometric: (payload) => api.post("/nfc/fingerprint", payload), // Unified with nfc routes

    // Emergency Override
    // authenticateEmergencyManager: (credentials) => api.post("/hospital/emergency/auth", credentials),

    // Clinical Records
    // createEmr: (payload) => api.post("/hospital/emr/create", payload),

    // Statistics
    getStats: () => api.get("/stats"),
};

export default hospitalAPI;
