import api from "../services/api"

export default {
    // NFC Scan (Trigger or check last)
    scanNfc: async (uid) => {
        const res = await api.post("/nfc/scan", { uid })
        return res.data
    },
    // Fingerprint Verify
    verifyFingerprint: async (fingerId) => {
        const res = await api.post("/nfc/fingerprint", { finger_id: fingerId })
        return res.data
    },
    // OTP Send
    sendOtp: async (phone) => {
        const res = await api.post("/otp/send-otp", { phone })
        return res.data
    },
    // OTP Verify
    verifyOtp: async (payload) => {
        const res = await api.post("/otp/verify-otp", payload)
        return res.data
    },
    // Fetch real patient data
    getPatientByUid: async (uid) => {
        const res = await api.get(`/patient/${uid}`)
        return res.data
    },
    getHistory: async () => {
        // Fallback to my audit logs until a specific doctor history route is added
        const res = await api.get("/audit/my")
        return res.data
    },
    getDeviceStatus: async () => {
        // Placeholder for device health
        return { status: "Online", nfc: "connected", gsm: "online" };
    }
}
