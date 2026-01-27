// bannerManagementApi.js
import api from './axios'; 

export const getBannerList = async () => {
  try {
    const response = await api.get('/api/banner/list');
    return response.data; 
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};



export const addBanner = async (bannerData) => {
  try {
    // Create a FormData object
    const formData = new FormData();
    
    // Append the basic fields
    formData.append('title', bannerData.title);
    formData.append('position', bannerData.position);
    formData.append('status', bannerData.status);

    
    formData.append('images[]', bannerData.imageUrl); 

    const response = await api.post('/api/banner/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error adding banner:", error.response?.data || error.message);
    throw error;
  }
};