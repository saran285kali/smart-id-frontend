import api from "./api";

const adminApi = {
    getStatistics: async () => {
        const res = await api.get("/stats");
        return res.data;
    },
    getAuditLogs: async () => {
        const res = await api.get("/logs");
        return res.data;
    },
    getUsers: async () => {
        const res = await api.get("/users");
        return res.data;
    },
    createUser: async (userData) => {
        const res = await api.post("/users", userData);
        return res.data;
    },
    toggleUserStatus: async (userId) => {
        const res = await api.patch(`/admin/users/${userId}/toggle`);
        return res.data;
    },
    savePermissions: async (payload) => {
        const res = await api.post("/admin/permissions", payload);
        return res.data;
    },
    getPermissions: async () => {
        const res = await api.get("/admin/permissions");
        return res.data;
    },
    getLatestNfc: async () => {
        const res = await api.get("/nfc");
        return res.data;
    }
};

export default adminApi;
