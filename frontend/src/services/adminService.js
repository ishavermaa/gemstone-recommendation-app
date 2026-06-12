import api from './api.js';

export const getAnalytics = () => api.get('/admin/analytics').then((res) => res.data);
export const getUsers = () => api.get('/admin/users').then((res) => res.data);
