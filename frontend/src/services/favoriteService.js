import api from './api.js';

export const addFavorite = (gemstoneId) => api.post('/favorites', { gemstoneId }).then((res) => res.data);
export const getFavorites = () => api.get('/favorites').then((res) => res.data);
export const removeFavorite = (id) => api.delete(`/favorites/${id}`).then((res) => res.data);
