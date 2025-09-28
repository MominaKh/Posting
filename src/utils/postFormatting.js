export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatPostData = (post) => {
  return {
    id: post._id,
    postId: post.postId,
    title: post.title || 'Untitled',
    description: post.description || '',
    image: post.image || '',
    community: post.community || '',
    date: formatDate(post.createdAt || post.savedAt || post.viewedAt),
    readTime: post.readTime || '0 min',
    tags: post.tags || [],
    author: post.author || { name: 'Anonymous', avatar: '' },
    upvotes: post.upvotes || 0,
    downvotes: post.downvotes || 0,
    comments: post.comments || 0,
    views: post.views || 0,
    bookmarked: post.bookmarked || false
  };
};