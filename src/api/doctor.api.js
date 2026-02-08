import api from "../services/api"

export default {
    scanNFC: async () => {
        // This will point to POST /doctor/nfc/scan in the future
        const res = await api.post("/doctor/nfc/scan")
        return res.data
    },
    getHistory: async () => {
        // This will point to GET /doctor/history in the future
        const res = await api.get("/doctor/history")
        return res.data
    }
}
