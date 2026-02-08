import api from "./api";

export const getPatientEMR = () =>
    api.get("/patient/emr");

export const getPatientAuditLog = () =>
    api.get("/patient/audit-log");
