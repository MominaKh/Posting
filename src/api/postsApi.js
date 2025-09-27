import { getAuthHeaders, getUserIdFromToken, AuthError } from '../utils/authUtils';

const API_BASE_URL = 'http://localhost:5000/api';

// Base API request handler for posts
const apiRequest = async (url, options = {}) => {
  console.log('Making API request to:', `${API_BASE_URL}${url}`);
  console.log('Request options:', options);
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });

    console.log('API response status:', response.status);
    console.log('API response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('API error data:', errorData);
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('API response data:', responseData);
    return responseData;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authenticated API request handler
const authenticatedRequest = async (url, options = {}) => {
  try {
    const authHeaders = getAuthHeaders();
    return await apiRequest(url, {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      }
    });
  } catch (error) {
    throw error;
  }
};

export const postsApi = {
  // Test API connection
  testConnection: async () => {
    try {
      console.log('Testing posts API connection...');
      return await apiRequest('/posts?limit=1');
    } catch (error) {
      console.error('Posts API connection test failed:', error);
      throw error;
    }
  },

  // Create Post (Protected) - Updated to work with your existing controller
  createPost: async (postData) => {
    const userId = getUserIdFromToken();
    console.log('Creating post with user ID:', userId);
    
    // Send data exactly as your Posts controller expects
    const postPayload = {
      post_title: postData.post_title,
      small_description: postData.small_description,
      post_description: postData.post_description,
      category: postData.category,
      tags: postData.tags || [],
      community: postData.community, // Just the community name as string
      user_id: userId, // Keep as string since your model uses String type
      thumbnail: postData.thumbnail || null,
      mediaInputs: postData.mediaInputs || []
    };
    
    console.log('Final post payload:', postPayload);
    
    return await authenticatedRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postPayload)
    });
  },

  // Get Posts (Public)
  getPosts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.skip) queryParams.append('skip', filters.skip);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.user_id) queryParams.append('user_id', filters.user_id);
    if (filters.community_id) queryParams.append('community_id', filters.community_id);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.tags) queryParams.append('tags', filters.tags.join(','));
    
    return await apiRequest(`/posts?${queryParams}`);
  },

  // Get Posts with Community Info (Public)
  getPostsWithCommunities: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.skip) queryParams.append('skip', filters.skip);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.user_id) queryParams.append('user_id', filters.user_id);
    if (filters.community_id) queryParams.append('community_id', filters.community_id);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.tags) queryParams.append('tags', filters.tags.join(','));
    
    const response = await apiRequest(`/posts?${queryParams}`);
    return response;
  },

  // Get Post by ID (Public) - with proper error handling
  getPostById: async (postId) => {
    try {
      console.log('Fetching post by ID:', postId);
      const response = await apiRequest(`/posts/${postId}`);
      console.log('Post API response:', response);
      
      // Ensure the response has the expected structure
      if (response.ok && response.post) {
        // Transform the post data to ensure all required fields exist
        const post = {
          ...response.post,
          tags: Array.isArray(response.post.tags) ? response.post.tags : [],
          author: response.post.author || { name: "Unknown", avatar: "" },
          post_title: response.post.post_title || "",
          small_description: response.post.small_description || "",
          community: response.post.community || "",
          upvotes: response.post.upvotes || 0,
          downvotes: response.post.downvotes || 0,
          views: response.post.views || 0,
          comments: response.post.comments || 0
        };
        
        return { ...response, post };
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }
  },

  // Get Post with Community Details
  getPostWithCommunity: async (postId) => {
    const post = await apiRequest(`/posts/${postId}`);
    
    // If the post has community_id but no community_name, fetch community details
    if (post.post && post.post.community_id && !post.post.community_name) {
      try {
        // Import communityApi dynamically to avoid circular imports
        const { communityApi } = await import('./communityApi');
        const communityResponse = await communityApi.getCommunityDetails(post.post.community_id);
        
        if (communityResponse.community) {
          post.post.community_name = communityResponse.community.community_name;
        }
      } catch (error) {
        console.error('Failed to fetch community details:', error);
        post.post.community_name = 'Unknown Community';
      }
    }
    
    return post;
  },

  // Search Posts (Public)
  searchPosts: async (searchParams = {}) => {
    const queryParams = new URLSearchParams();
    
    if (searchParams.q) queryParams.append('q', searchParams.q);
    if (searchParams.tags) queryParams.append('tags', searchParams.tags);
    if (searchParams.category) queryParams.append('category', searchParams.category);
    if (searchParams.page) queryParams.append('page', searchParams.page);
    if (searchParams.limit) queryParams.append('limit', searchParams.limit);
    
    return await apiRequest(`/posts/search?${queryParams}`);
  },

  // Update Post (Protected)
  updatePost: async (postId, updateData) => {
    const userId = getUserIdFromToken();
    
    // Convert userId if needed
    let processedUserId = userId;
    if (!isNaN(userId) && !isNaN(parseFloat(userId))) {
      processedUserId = Number(userId);
    }
    
    const payload = {
      ...updateData,
      user_id: processedUserId
    };
    
    return await authenticatedRequest(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  // Delete Post (Protected)
  deletePost: async (postId) => {
    const userId = getUserIdFromToken();
    
    // Convert userId if needed
    let processedUserId = userId;
    if (!isNaN(userId) && !isNaN(parseFloat(userId))) {
      processedUserId = Number(userId);
    }
    
    return await authenticatedRequest(`/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: processedUserId })
    });
  },

  // Get Post Status (Protected)
  getPostStatus: async (postId) => {
    return await authenticatedRequest(`/posts/${postId}/status`);
  }
};