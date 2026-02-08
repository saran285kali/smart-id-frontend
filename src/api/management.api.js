import api from "../services/api";

const hospitalAPI = {
    registerPatient: (payload) => api.post("/hospital/patients", payload),

    // Patient Session & NFC
    getPatientByNfc: (nfcId) => api.get(`/hospital/patients/by-nfc/${nfcId}`),

    // OTP Consent flow
    sendOtp: (patientId) => api.post("/hospital/otp/send", { patientId }),
    verifyOtp: (patientId, code) => api.post("/hospital/otp/verify", { patientId, otp: code }),
    resendOtp: (patientId) => api.post("/hospital/otp/resend", { patientId }),
    sendNomineeOtp: (patientId) => api.post("/hospital/otp/send-nominee", { patientId }),

    // Biometric Verification
    verifyBiometric: (patientId, subject) => api.post("/hospital/biometric/verify", { patientId, subject }),

    // Emergency Override
    authenticateEmergencyManager: (credentials) => api.post("/hospital/emergency/auth", credentials),

    // Clinical Records
    createEmr: (payload) => api.post("/hospital/emr/create", payload),

    // Statistics
    getStats: () => api.get("/hospital/stats"),
};

export default hospitalAPI;
