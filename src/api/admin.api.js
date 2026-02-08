import api from "../services/api";

const adminApi = {
    getStatistics: async () => {
        const res = await api.get("/admin/statistics");
        return res.data;
    },
    getAuditLogs: async () => {
        const res = await api.get("/admin/audit-logs");
        return res.data;
    },
    getUsers: async () => {
        const res = await api.get("/admin/users");
        return res.data;
    },
    createUser: async (userData) => {
        const res = await api.post("/admin/users", userData);
        return res.data;
    },
    toggleUserStatus: async (userId) => {
        const res = await api.patch(`/admin/users/${userId}/toggle`);
        return res.data;
    }
};

export default adminApi;
