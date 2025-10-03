import { getAuthHeaders, getUserIdFromToken, AuthError } from '../utils/authUtils';

const API_BASE_URL = 'http://localhost:5001/api';

// Base API request handler
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Handle network connection errors specifically
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(`Cannot connect to communities service at ${API_BASE_URL}. Please check if the server is running.`);
    }
    
    if (error instanceof AuthError) {
      throw error;
    }
    
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

// Form data builder for community operations
const buildCommunityFormData = (communityData, imageFile = null, includeUserId = true) => {
  const formData = new FormData();
  
  if (includeUserId) {
    const userId = getUserIdFromToken();
    console.log('Including userId in form data:', userId);
    formData.append('userId', userId);
  }
  
  if (communityData.community_name) {
    formData.append('community_name', communityData.community_name);
  }
  if (communityData.description) {
    formData.append('description', communityData.description);
  }
  
  if (communityData.community_tags && communityData.community_tags.length > 0) {
    communityData.community_tags.forEach(tag => {
      formData.append('community_tags[]', tag);
    });
  }
  
  if (communityData.visible) {
    formData.append('visible', communityData.visible);
  }
  if (communityData.moderation) {
    formData.append('moderation', communityData.moderation);
  }
  
  if (imageFile && imageFile instanceof File) {
    formData.append('image', imageFile);
  }
  
  return formData;
};

export const communityApi = {
  // Discover Communities (Public)
  discoverCommunities: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.tags) queryParams.append('tags', filters.tags.join(','));
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.visible) queryParams.append('visible', filters.visible);
    
    return await apiRequest(`/communities/discover?${queryParams}`);
  },

  // Get Community Details (Public)
  getCommunityDetails: async (communityId) => {
    return await apiRequest(`/communities/${communityId}`);
  },

  // Get All Communities (Public)
  getAllCommunities: async (searchQuery = '') => {
    const queryParams = searchQuery.trim() 
      ? `?search=${encodeURIComponent(searchQuery.trim())}`
      : '';
    
    return await authenticatedRequest(`/communities/all${queryParams}`);
  },

  // Create Community (Protected)
  createCommunity: async (communityData, imageFile = null) => {
    const formData = buildCommunityFormData(communityData, imageFile, true);
    
    return await authenticatedRequest('/communities', {
      method: 'POST',
      body: formData,
    });
  },

  // Update Community (Protected)
  updateCommunity: async (communityId, communityData, imageFile = null) => {
    const formData = buildCommunityFormData(communityData, imageFile, true);
    
    return await authenticatedRequest(`/communities/${communityId}`, {
      method: 'PUT',
      body: formData,
    });
  },

  // Delete Community (Protected)
  deleteCommunity: async (communityId) => {
    const userId = getUserIdFromToken();
    
    return await authenticatedRequest(`/communities/${communityId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
  },

  // Follow Community (Protected)
  followCommunity: async (communityId) => {
    const userId = getUserIdFromToken();
    
    return await authenticatedRequest(`/communities/${communityId}/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
  },

  // Unfollow Community (Protected)
  unfollowCommunity: async (communityId) => {
    const userId = getUserIdFromToken();
    
    return await authenticatedRequest(`/communities/${communityId}/unfollow`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
  },

  // Get User's Communities (Protected)
  getUserCommunities: async (searchQuery = '', forceRefresh = false) => {
    const userId = getUserIdFromToken();
    
    let queryParams = searchQuery.trim() 
      ? `?search=${encodeURIComponent(searchQuery.trim())}`
      : '';
    
    if (forceRefresh) {
      const separator = queryParams ? '&' : '?';
      queryParams += `${separator}_t=${Date.now()}`;
    }
    
    // Get user's owned and followed communities
    const userCommunities = await authenticatedRequest(`/communities/user/${userId}${queryParams}`);
    
    // Get all communities to find moderated ones
    const allCommunities = await communityApi.getAllCommunities(searchQuery); // Changed from this.getAllCommunities
    
    // Find communities where user is moderator but not owner or follower
    const moderatedCommunities = (allCommunities.communities || []).filter(community => {
      const isOwner = community.userId === userId;
      const isFollower = userCommunities.followed?.some(fc => fc._id === community._id);
      const isModerator = community.moderators && community.moderators.includes(userId);
      
      return isModerator && !isOwner && !isFollower;
    });
    
    return {
      owned: userCommunities.owned || [],
      followed: [...(userCommunities.followed || []), ...moderatedCommunities]
    };
  },

  // Add Moderator (Protected)
  addModerator: async (communityId, moderatorUserId) => {
    const userId = getUserIdFromToken();
    
    return await authenticatedRequest(`/communities/${communityId}/moderators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, moderatorUserId })
    });
  },

  // Remove Moderator (Protected)
  removeModerator: async (communityId, moderatorUserId) => {
    const userId = getUserIdFromToken();
    
    return await authenticatedRequest(`/communities/${communityId}/moderators/${moderatorUserId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
  },

  // Update Community Settings (Protected)
  updateCommunitySettings: async (communityId, settings) => {
    const userId = getUserIdFromToken();
    
    return await authenticatedRequest(`/communities/${communityId}/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...settings, userId })
    });
  },

  // Add Post to Community (Protected) - Updates community post count
  addPostToCommunity: async (communityId, postId) => {
    const userId = getUserIdFromToken();
    
    console.log('Adding post to community:', {
      communityId,
      postId,
      userId,
      url: `${API_BASE_URL}/communities/${communityId}/posts`
    });
    
    try {
      const response = await authenticatedRequest(`/communities/${communityId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, postId })
      });
      
      console.log('Add post to community response:', response);
      return response;
    } catch (error) {
      console.error('Error in addPostToCommunity:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Cannot connect to communities service')) {
        throw new Error('Communities service is unavailable. Post was created but community count may not be updated.');
      } else if (error.message.includes('404')) {
        throw new Error('Community post management endpoint not found. Please check if the route is properly configured.');
      } else if (error.message.includes('403')) {
        throw new Error('Access denied. You do not have permission to update this community.');
      }
      
      throw error;
    }
  },

  // Remove Post from Community (Protected) - Updates community post count
  removePostFromCommunity: async (communityId, postId) => {
    const userId = getUserIdFromToken();
    
    console.log('Removing post from community:', {
      communityId,
      postId,
      userId,
      url: `${API_BASE_URL}/communities/${communityId}/posts/${postId}`
    });
    
    try {
      const response = await authenticatedRequest(`/communities/${communityId}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      console.log('Remove post from community response:', response);
      return response;
    } catch (error) {
      console.error('Error in removePostFromCommunity:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Cannot connect to communities service')) {
        throw new Error('Communities service is unavailable. Post deletion may not update community count.');
      } else if (error.message.includes('404')) {
        throw new Error('Community or post not found for removal.');
      } else if (error.message.includes('403')) {
        throw new Error('Access denied. You do not have permission to remove posts from this community.');
      }
      
      throw error;
    }
  },

  // Get Community Posts (Public)
  getCommunityPosts: async (communityId, page = 1, limit = 10) => {
    console.log('getCommunityPosts called with:', { communityId, page, limit });
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    try {
      const url = `/communities/${communityId}/posts?${queryParams}`;
      console.log('Making request to:', `${API_BASE_URL}${url}`);
      
      const response = await apiRequest(url);
      console.log('getCommunityPosts raw response:', response);
      
      // Check if the response structure is correct
      if (response && response.community) {
        console.log('Community posts found:', response.community.posts);
        return {
          ...response,
          community: {
            ...response.community,
            posts: response.community.posts || []
          }
        };
      } else {
        console.log('Unexpected response structure:', response);
        // Fallback: try to get posts directly from getCommunityDetails
        const detailsResponse = await apiRequest(`/communities/${communityId}`);
        console.log('Fallback - community details response:', detailsResponse);
        
        if (detailsResponse && detailsResponse.community && detailsResponse.community.posts) {
          return {
            success: true,
            community: {
              ...detailsResponse.community,
              posts: detailsResponse.community.posts,
              totalPosts: detailsResponse.community.posts.length,
              page: parseInt(page),
              limit: parseInt(limit),
              totalPages: Math.ceil(detailsResponse.community.posts.length / limit)
            }
          };
        }
      }
      
      // If we get here, something went wrong
      console.log('No posts found in any response format');
      return {
        success: false,
        community: {
          posts: [],
          totalPosts: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('Error fetching community posts:', error);
      
      // Fallback: try to get posts from community details
      try {
        console.log('Attempting fallback to getCommunityDetails...');
        const detailsResponse = await apiRequest(`/communities/${communityId}`);
        console.log('Fallback response:', detailsResponse);
        
        if (detailsResponse && detailsResponse.community && detailsResponse.community.posts) {
          console.log('Fallback successful, found posts:', detailsResponse.community.posts);
          return {
            success: true,
            community: {
              ...detailsResponse.community,
              posts: detailsResponse.community.posts,
              totalPosts: detailsResponse.community.posts.length,
              page: parseInt(page),
              limit: parseInt(limit),
              totalPages: Math.ceil(detailsResponse.community.posts.length / limit)
            }
          };
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
      
      // Return safe fallback structure
      return {
        success: false,
        community: {
          posts: [],
          totalPosts: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0
        }
      };
    }
  },
};