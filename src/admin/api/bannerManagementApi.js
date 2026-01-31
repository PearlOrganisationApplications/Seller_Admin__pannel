import api from './axios'; 

export const getBannerList = async () => {
  const response = await api.get('/api/banner/list');
  return response.data; 
};

export const addBanner = async (bannerData) => {
  const formData = new FormData();
  formData.append('title', bannerData.title);
  formData.append('position', bannerData.position);
  formData.append('status', bannerData.status);

  if (bannerData.imageFiles) {
    Array.from(bannerData.imageFiles).forEach((file) => {
      formData.append('images[]', file);
    });
  }

  const response = await api.post('/api/banner/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// UPDATED
export const updateBannerStatus = async (id, bannerData) => {
  const formData = new FormData();
  formData.append('title', bannerData.title);
  formData.append('position', bannerData.position);
  formData.append('status', bannerData.status);

  // If the user selected new images during edit, add them
  if (bannerData.imageFiles) {
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