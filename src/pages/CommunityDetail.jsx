import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import Navbar from "../shared/Navbar";
import CommunityFilterBar from "../components/CommunityDetail/CommunityFilterBar";
import BlogCard from "../components/BlogListing/BlogCard";
import MemberCard from "../components/CommunityDetail/MemberCard";
import FollowingButton from "../components/CommunityDetail/FollowingButton";
import JoinChatButton from "../components/CommunityDetail/JoinChatButton";
import VideoRoomButton from "../components/CommunityDetail/VideoRoomButton";
import NewPostButton from "../shared/NewPostButton";
import { communityApi } from "../api/communityApi";

const FILTERS = ["Posts", "Members", "About"];

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, loading: authLoading } = useAuth();
  
  const [selectedFilter, setSelectedFilter] = useState("Posts");
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Initialize auth check and fetch community data
  useEffect(() => {
    if (!authLoading && !auth?.token) {
      navigate('/login', { 
        state: { from: `/community/${id}` },
        replace: true 
      });
      return;
    }
    
    if (!authLoading && auth?.token) {
      fetchCommunityData();
    }
  }, [id, auth, authLoading, navigate]);

  const fetchCommunityData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await communityApi.getCommunityDetails(id);
      setCommunity(response.community);
      
      // Check if user is following this community
      const isUserFollowing = response.community.members?.includes(auth.user?._id);
      setIsFollowing(isUserFollowing);
      
    } catch (err) {
      console.error('Error fetching community details:', err);
      setError('Failed to load community details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await communityApi.unfollowCommunity(id);
        setIsFollowing(false);
        // Update local community data
        setCommunity(prev => ({
          ...prev,
          members: prev.members?.filter(memberId => memberId !== auth.user?._id) || [],
          no_of_followers: Math.max(0, (prev.no_of_followers || 1) - 1)
        }));
      } else {
        await communityApi.followCommunity(id);
        setIsFollowing(true);
        // Update local community data
        setCommunity(prev => ({
          ...prev,
          members: [...(prev.members || []), auth.user?._id],
          no_of_followers: (prev.no_of_followers || 0) + 1
        }));
      }
    } catch (err) {
      console.error('Error toggling follow status:', err);
      setError(`Failed to ${isFollowing ? 'unfollow' : 'follow'} community. Please try again.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!auth?.token) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <div className="text-white text-lg">Loading community...</div>
      </div>
    );
  }

  // Error state
  if (error && !community) {
    return (
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button 
            onClick={fetchCommunityData}
            className="px-4 py-2 bg-periwinkle text-white rounded-lg hover:bg-periwinkle/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No community found
  if (!community) {
    return (
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-desc text-lg mb-4">Community not found</div>
        </div>
      </div>
    );
  }

  const isOwner = community.user_id === auth.user?._id || community.user_id?._id === auth.user?._id;

  const renderContent = () => {
    switch (selectedFilter) {
      case "Posts":
        return (
          <div className="flex flex-col gap-6 pb-12">
            <div className="flex justify-between items-center">
              <h2 className="font-fenix text-3xl md:text-4xl text-white font-normal">Community Posts</h2>
              <NewPostButton />
            </div>
            <div className="flex flex-col gap-7">
              {community.posts && community.posts.length > 0 ? (
                community.posts.map((blog) => (
                  <BlogCard key={blog.id} {...blog} />
                ))
              ) : (
                <div className="text-center text-desc py-8">
                  No posts found in this community.
                </div>
              )}
            </div>
          </div>
        );
      case "Members":
        return (
          <div className="flex flex-col gap-6 pb-12">
            <h2 className="font-fenix text-3xl md:text-4xl text-white font-normal">Community Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {community.members && community.members.length > 0 ? (
                community.members.map((member) => (
                  <MemberCard key={member.id} {...member} />
                ))
              ) : (
                <div className="text-center text-desc py-8">
                  No members found in this community.
                </div>
              )}
            </div>
          </div>
        );
      case "About":
        return (
          <div className="pb-12">
            <h2 className="font-fenix text-3xl md:text-4xl text-white font-normal mb-8">About the Community</h2>
            <div 
              className="bg-navbar-bg rounded-xl p-8 border"
              style={{
                border: "1px solid var(--navbar-border)",
              }}
            >
              <div className="space-y-6 text-columbia-blue">
                <p className="font-lato text-lg leading-relaxed">
                  {community.description}
                </p>
                
                <div>
                  <h4 className="font-lato font-semibold text-white text-lg mb-3">Community Settings</h4>
                  <ul className="space-y-2 font-lato">
                    <li className="flex items-start">
                      <span className="text-periwinkle mr-2">•</span>
                      Visibility: {community.visible === 'public' ? 'Public' : 'Private'}
                    </li>
                    <li className="flex items-start">
                      <span className="text-periwinkle mr-2">•</span>
                      Moderation: {community.moderation}
                    </li>
                    {community.community_tags && community.community_tags.length > 0 && (
                      <li className="flex items-start">
                        <span className="text-periwinkle mr-2">•</span>
                        Tags: {community.community_tags.join(', ')}
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-lato font-semibold text-white text-lg mb-3">Community Admin</h4>
                  <p className="font-lato leading-relaxed">
                    Created by {community.user_id?.username || 'Unknown'} 
                    {community.createdAt && ` on ${new Date(community.createdAt).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-rich-black flex flex-col relative">
      <Navbar />

      {/* Background Glow */}
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

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4 text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Community Header */}
      <div className="w-full flex justify-center pt-8 pb-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-7xl">
          {/* Community Info */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Left: Avatar + Info */}
              <div className="flex items-start gap-8 flex-1">
                <img
                  src={community.image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"}
                  alt={community.community_name}
                  className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover flex-shrink-0 ml-8"
                />
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <h1 className="font-fenix text-3xl md:text-4xl text-white font-normal mb-4 lg:mb-0">
                      {community.community_name}
                    </h1>
                    
                    {/* Action Buttons - positioned at title level */}
                    <div className="flex gap-3 flex-shrink-0">
                      <button
                        onClick={handleFollowToggle}
                        className={`px-4 py-2 rounded-lg font-lato font-medium text-sm border transition-colors ${
                          isFollowing
                            ? isOwner 
                              ? "border-periwinkle bg-transparent text-periwinkle cursor-default"
                              : "border-periwinkle bg-transparent text-periwinkle hover:bg-periwinkle/10"
                            : "border-white bg-transparent text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="flex items-center">
                          <span className="material-icons text-base mr-1">
                            {isFollowing ? "check" : "add"}
                          </span>
                          {isFollowing ? (isOwner ? "Admin" : "Following") : "Follow"}
                        </span>
                      </button>
                      <JoinChatButton />
                      <VideoRoomButton />
                    </div>
                  </div>
                  
                  {/* Description spans full width under buttons */}
                  <p className="font-lato text-columbia-blue text-base md:text-lg leading-relaxed mb-6 pr-4">
                    {community.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 text-periwinkle font-lato text-sm flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-base">people</span>
                      <span>{community.no_of_followers?.toLocaleString() || 0} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-base">article</span>
                      <span>{community.no_of_posts?.toLocaleString() || 0} posts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-icons text-base">visibility</span>
                      <span>{community.no_of_views?.toLocaleString() || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full flex justify-center px-4 lg:px-8">
        <div className="w-full max-w-7xl">
          {/* Filter Bar */}
          <div className="mb-8">
            <CommunityFilterBar
              filters={FILTERS}
              selected={selectedFilter}
              onSelect={setSelectedFilter}
            />
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;