import api from './api.js';

export const registerUser = (payload) => api.post('/auth/register', payload).then((res) => res.data);
export const loginUser = (payload) => api.post('/auth/login', payload).then((res) => res.data);
export const getProfile = () => api.get('/profile').then((res) => res.data);
export const updateProfile = (payload) => api.put('/profile', payload).then((res) => res.data);
export const changePassword = (payload) => api.post('/profile/change-password', payload).then((res) => res.data);
