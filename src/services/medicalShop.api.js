import api from "../services/api";

const medicalShopApi = {
    scanNFC: async () => {
        const res = await api.post("/medical-shop/nfc/scan");
        return res.data;
    },
    fetchPrescriptionPDF: async (prescriptionId) => {
        const res = await api.get(
            `/medical-shop/prescriptions/${prescriptionId}/pdf`,
            { responseType: "blob" }
        );
        return res.data;
    }
};

export default medicalShopApi;
