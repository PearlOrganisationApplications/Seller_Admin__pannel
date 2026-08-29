import api from './axios'; 

export const getBannerList = async () => {
  const response = await api.get('/api/banner/list');
  return response.data; 
};

export const addBanner = async (data) => {
  try {
    const fd = new FormData();

    fd.append("title", data.title);
    fd.append("banner_type", data.banner_type);
    fd.append("status", data.status);

    data.imageFiles.forEach((file) => {
      fd.append("images[]", file);
    });

    const response = await api.post("/api/banner/add", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
// UPDATED
export const updateBannerStatus = async (id, bannerData) => {
  const formData = new FormData();

  formData.append('title', bannerData.title ?? '');
  formData.append('position', bannerData.position != null ? String(bannerData.position) : '');
const statusBool =
  bannerData.status === true ||
  bannerData.status === 'true' ||
  bannerData.status === 1 ||
  bannerData.status === '1';

formData.append('status', statusBool ? '1' : '0');
  if (bannerData.imageFiles && bannerData.imageFiles.length > 0) {
    Array.from(bannerData.imageFiles).forEach((file) => {
      formData.append('images[]', file);
    });
  }

  const response = await api.post(`/api/banner/update-status/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteBanner = async (id) => {
  const response = await api.delete(`/api/banner/delete/${id}`);
  return response.data;
};