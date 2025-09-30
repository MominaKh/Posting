import axios from 'axios';

const API_URL = 'http://localhost:5004/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// For demo purposes, using a default userId. In production, this would come from auth context
const DEFAULT_USER_ID = 'user123';

// Saved Posts API
export const savePost = async (postId, category) => {
  try {
    const response = await api.post('/saved/save', { postId, category, userId: DEFAULT_USER_ID });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSavedPosts = async (category) => {
  try {
    const response = await api.get('/saved', { params: { category, userId: DEFAULT_USER_ID } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchSavedPosts = async (searchTerm, category) => {
  try {
    const response = await api.get('/saved/search', {
      params: { searchTerm, category, userId: DEFAULT_USER_ID }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkSavedStatus = async (postId) => {
  try {
    const response = await api.get(`/saved/check/${postId}`, { params: { userId: DEFAULT_USER_ID } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// History API
export const recordView = async (postId) => {
  try {
    const response = await api.post('/history', { postId, userId: DEFAULT_USER_ID });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getHistory = async (page = 1, limit = 10) => {
  try {
    console.log('API: Calling getHistory with params:', { page, limit, userId: DEFAULT_USER_ID });
    const response = await api.get('/history', {
      params: { page, limit, userId: DEFAULT_USER_ID }
    });
    console.log('API: getHistory raw response:', response);
    return response.data;
  } catch (error) {
    console.error('API: getHistory error:', error);
    console.error('API: Error response:', error.response);
    throw error.response?.data || { message: error.message };
  }
};

export const searchHistory = async (searchTerm) => {
  try {
    console.log('API: Calling searchHistory with params:', { searchTerm, userId: DEFAULT_USER_ID });
    const response = await api.get('/history/search', {
      params: { q: searchTerm, userId: DEFAULT_USER_ID }
    });
    console.log('API: searchHistory raw response:', response);
    return response.data;
  } catch (error) {
    console.error('API: searchHistory error:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const clearHistory = async () => {
  try {
    console.log('API: Calling clearHistory with userId:', DEFAULT_USER_ID);
    const response = await api.delete('/history', { 
      data: { userId: DEFAULT_USER_ID } 
    });
    console.log('API: clearHistory raw response:', response);
    return response.data;
  } catch (error) {
    console.error('API: clearHistory error:', error);
    throw error.response?.data || { message: error.message };
  }
};