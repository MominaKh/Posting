import { recordView } from '../api/curationApi';

export const trackPostView = async (postId) => {
  try {
    await recordView(postId);
  } catch (error) {
    // Silently fail for view tracking to not disrupt user experience
    console.error('Failed to track post view:', error);
  }
};