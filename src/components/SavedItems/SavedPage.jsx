import React, { useState, useEffect } from "react";
import SavedFilterBar from "./SavedFilterBar";
import SearchBar from "../../shared/SearchBar";
import BlogCard from "../BlogListing/BlogCard";
import { getSavedPosts, searchSavedPosts } from "../../api/curationApi";
import LoadingState from "../../shared/LoadingState.jsx";

const SavedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const formatPostData = (post) => ({
    ...post,
    id: post.postId || post._id,
    date: new Date(post.savedAt || post.createdAt).toLocaleDateString(),
    // For now, we'll use placeholder data until the backend is updated to populate full post data
    title: post.title || `Saved Post ${post.postId}`,
    description: post.description || 'This post has been saved to your collection.',
    image: post.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    community: post.community || 'General',
    readTime: post.readTime || '5 min',
    tags: post.tags || [],
    author: post.author || { name: 'Unknown', avatar: '' },
    upvotes: post.upvotes || 0,
    downvotes: post.downvotes || 0,
    comments: post.comments || 0,
    views: post.views || 0,
    user_id: post.user_id
  });

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const response = await getSavedPosts();
      // Handle different response structures
      const postsData = response.data || response || [];
      const formattedPosts = Array.isArray(postsData) ? postsData.map(formatPostData) : [];
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchSavedPosts();
      return;
    }

    try {
      setLoading(true);
      const response = await searchSavedPosts(query);
      // Handle different response structures
      const postsData = response.data || response || [];
      const formattedPosts = Array.isArray(postsData) ? postsData.map(formatPostData) : [];
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error searching saved posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading saved posts..." />;
  }

  return (
    <div className="min-h-screen bg-rich-black text-white relative">
      {/* Background Glow Effect */}
      <div
        className="absolute z-0"
        style={{
          width: 637,
          height: 300,
          top: -38,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1A1842B3",
          filter: "blur(100px)",
          boxShadow: "0px 4px 100px 500px #00000066",
          borderRadius: 30,
          pointerEvents: "none",
        }}
      />
      
      <div className="container mx-auto px-5 sm:px-7 lg:px-10 py-8 relative z-10">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div>
              <h1 className="font-fenix text-[28px] text-white mb-1">
                Saved Items
              </h1>
              <p className="text-desc text-base">
                Access your bookmarked content anytime
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-[500px]">
              <SearchBar 
                placeholder="Search saved posts..."
                value={searchQuery}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-icons text-6xl text-columbia-blue mb-4 block">
                bookmark_border
              </span>
              <h3 className="font-fenix text-2xl text-white mb-2">
                {searchQuery ? "No posts match your search" : "No saved items yet"}
              </h3>
              <p className="text-columbia-blue">
                {searchQuery ? "Try different search terms" : "Start bookmarking posts to see them here"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.postId || post._id} // Use postId from saved post data, fallback to _id
                  image={post.image}
                  community={post.community}
                  date={post.date}
                  readTime={post.readTime}
                  title={post.title}
                  description={post.description}
                  tags={post.tags}
                  author={post.author}
                  upvotes={post.upvotes}
                  downvotes={post.downvotes}
                  comments={post.comments}
                  views={post.views}
                  user_id={post.user_id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPage;