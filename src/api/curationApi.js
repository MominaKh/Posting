import axios from 'axios';

const API_URL = 'http://localhost:5008/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Saved Posts API
export const savePost = async (postId, category) => {
  try {
    const response = await api.post('/saved/save', { postId, category });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSavedPosts = async (category) => {
  try {
    const response = await api.get('/saved', { params: { category } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchSavedPosts = async (searchTerm, category) => {
  try {
    const response = await api.get('/saved/search', {
      params: { searchTerm, category }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkSavedStatus = async (postId) => {
  try {
    const response = await api.get(`/saved/check/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// History API
export const recordView = async (postId) => {
  try {
    const response = await api.post('/history', { postId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getHistory = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/history', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchHistory = async (searchTerm) => {
  try {
    const response = await api.get('/history/search', {
      params: { searchTerm }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const clearHistory = async () => {
  try {
    const response = await api.delete('/history');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};