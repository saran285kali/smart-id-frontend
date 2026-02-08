import api from "../services/api";

const patientApi = {
    getProfile: async () => {
        const res = await api.get("/patient/profile");
        return res.data;
    },
    getMedicalRecords: async () => {
        const res = await api.get("/patient/records");
        return res.data;
    },
    getPrescriptions: async () => {
        const res = await api.get("/patient/prescriptions");
        return res.data;
    },
    sendOtp: async (phone) => {
        const res = await api.post("/patient/auth/otp/send", { phone });
        return res.data;
    },
    verifyOtp: async (phone, otp) => {
        const res = await api.post("/patient/auth/otp/verify", { phone, otp });
        return res.data;
    }
};

export default patientApi;
