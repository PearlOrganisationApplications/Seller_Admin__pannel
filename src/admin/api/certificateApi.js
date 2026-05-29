import api from "./axios";

export const getKalkiCertificates = async () => {
  const response = await api.get(
    "/api/admin/kalkicertificate-requests"
  );

  return response.data;
};

export const updateKalkiCertificate = async (payload) => {
  const response = await api.post(
    "/api/admin/kalkicertificate-update",
    payload
  );

  return response.data;
};