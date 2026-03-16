import api from "../services/api"

export default {
    // NFC Scan
    scanNfc: async () => {
        const res = await api.get("/nfc/wait-scan")
        return res.data
    },
    // Fingerprint Verify
    verifyFingerprint: async () => {
        const res = await api.get("/fingerprint/verify")
        return res.data
    },
    // OTP Send
    sendOtp: async (phone) => {
        const res = await api.post("/auth/send-otp", { phone })
        return res.data
    },
    // OTP Verify
    verifyOtp: async (payload) => {
        const res = await api.post("/auth/verify-otp", payload)
        return res.data
    },
    // Fetch real patient data
    getPatientByUid: async (uid) => {
        const res = await api.get(`/patient/${uid}`)
        return res.data
    },
    getHistory: async () => {
        const res = await api.get("/doctor/history")
        return res.data
    },
    getDeviceStatus: async () => {
        const res = await api.get("/device-status")
        return res.data
    }
}
