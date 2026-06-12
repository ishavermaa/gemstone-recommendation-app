import api from './api.js';

export const getGemstones = (params) => api.get('/gemstones', { params }).then((res) => res.data);
export const getGemstone = (id) => api.get(`/gemstones/${id}`).then((res) => res.data);
export const createGemstone = (payload) => api.post('/gemstones', payload).then((res) => res.data);
export const updateGemstone = (id, payload) => api.put(`/gemstones/${id}`, payload).then((res) => res.data);
export const deleteGemstone = (id) => api.delete(`/gemstones/${id}`).then((res) => res.data);
