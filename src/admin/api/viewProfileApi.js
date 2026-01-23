import api from './axios'; 

// GET: Profile Details
export const getProfile = () => {
  return api.get('/api/admin/profile');
};

// POST: Update Profile
export const updateProfileData = (formData) => {
  return api.post('/api/admin/profile-update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};