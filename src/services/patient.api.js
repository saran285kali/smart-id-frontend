import api from "./api";

const patientApi = {
    getProfile: async () => {
        const res = await api.get("/patient/profile");
        return res.data;
    },
    getMedicalRecords: async () => {
        const res = await api.get("/patient/records");
        return res.data;
    },
    getPatientEMR: async () => {
        const res = await api.get("/patient/emr");
        return res.data;
    },
    getPrescriptions: async () => {
        const res = await api.get("/patient/prescriptions");
        return res.data;
    },
    getPatientAuditLog: async () => {
        const res = await api.get("/patient/audit-log");
        return res.data;
    },
    sendOtp: async (phone) => {
        const res = await api.post("/patient/auth/otp/send", { phone });
        return res.data;
    },
    verifyOtp: async (phone, otp, idToken) => {
        const res = await api.post("/patient/auth/otp/verify", { phone, otp, idToken });
        return res.data;
    }
};

export default patientApi;
