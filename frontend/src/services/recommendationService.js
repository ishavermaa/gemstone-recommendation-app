import api from './api.js';

export const createRecommendation = (payload) => api.post('/recommendations', payload).then((res) => res.data);
export const getRecommendations = () => api.get('/recommendations').then((res) => res.data);
export const deleteRecommendation = (id) => api.delete(`/recommendations/${id}`).then((res) => res.data);
