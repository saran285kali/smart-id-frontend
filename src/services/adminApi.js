import api from "./api";

export const getUsers = () =>
    api.get("/admin/users");

export const savePermissions = (payload) =>
    api.post("/admin/permissions", payload);
