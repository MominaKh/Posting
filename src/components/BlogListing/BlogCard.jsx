import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../../api/ProfileApi";
import { useSavePost } from "../../hooks/useSavePost";
import { recordView } from "../../api/curationApi";

const BlogCard = ({
  id,
  image,
  community,
  date,
  readTime,
  title,
  description,
  tags = [], // Default to empty array
  author = { name: "Unknown", avatar: "" }, // Default author object
  upvotes = 0,
  downvotes = 0,
  comments = 0,
  views = 0,
  user_id, // Add user_id prop to fetch profile
}) => {
  // State for toggles
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  
  // State for user profile
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Use the save post hook for bookmark functionality
  const { isSaved, isLoading: saveLoading, toggleSave } = useSavePost(id);

  // Navigation hook
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user_id) {
        console.log('No user_id provided for post:', id);
        return;
      }

      setProfileLoading(true);
      try {
        console.log(`Fetching profile for user_id: ${user_id} (Post: ${id})`);
        const response = await getProfile(user_id);
        console.log('Profile API response for user', user_id, ':', response);
        
        if (response && response.data) {
          setUserProfile(response.data);
          console.log('User profile data for BlogCard:', {
            user_id: user_id,
            profileData: response.data,
            name: response.data.name || response.data.user?.name || 'Unknown',
            profileImage: response.data.profileImage,
            username: response.data.username
          });
        } else {
          console.log('No profile data found for user:', user_id);
        }
      } catch (error) {
        console.error(`Error fetching profile for user ${user_id}:`, error);
        console.log('Profile fetch failed, will use fallback data');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user_id, id]);

  // Handlers
  const handleCardClick = async (e) => {
    e.preventDefault(); // prevent default Link navigation
    try {
      // Record the view in history
      await recordView(id);
      console.log(`Recorded view for post ${id}`);
    } catch (error) {
      console.error('Error recording view:', error);
      // Continue with navigation even if history recording fails
    }
    // Navigate to the post detail page
    navigate(`/post/${id}`);
  };

  const toggleBookmark = async (e) => {
    e.preventDefault(); // prevent navigation
    try {
      await toggleSave('Saved'); // Default category
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };
  const toggleUpvote = (e) => {
    e.preventDefault();
    setIsUpvoted(!isUpvoted);
    if (isDownvoted) setIsDownvoted(false); // can't be both
  };
  const toggleDownvote = (e) => {
    e.preventDefault();
    setIsDownvoted(!isDownvoted);
    if (isUpvoted) setIsUpvoted(false);
  };

  // Get author info from profile or fallback to props
  const getAuthorInfo = () => {
    if (userProfile) {
      const name = userProfile.name || userProfile.user?.name || userProfile.username || "Unknown";
      const avatar = userProfile.profileImage || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;
      
      return { name, avatar };
    }
    
    // Fallback to props or default
    return {
      name: author?.name || "Unknown",
      avatar: author?.avatar || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
    };
  };

  const authorInfo = getAuthorInfo();
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <Link
      to={`/post/${id}`}
      onClick={handleCardClick}
      className="block bg-navbar-bg rounded-xl overflow-hidden border z-0 hover:bg-white/5 transition"
      style={{ border: "1px solid var(--navbar-border)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 relative">
        {/* Blog Image */}
        <div className="md:col-span-1 flex items-center">
          <img
            alt={title}
            className="rounded-lg w-full h-full object-cover min-h-[140px] max-h-[210px]"
            src={image}
          />
        </div>

        {/* Blog Content */}
        <div className="md:col-span-2 flex flex-col">
          {/* Community, date, readTime */}
          <div className="flex items-center text-sm mb-2 font-lato">
            <span className="text-periwinkle px-3 py-1 rounded-xl font-semibold border-solid border-1">
              {community}
            </span>
            <span className="mx-2 text-periwinkle">·</span>
            <span className="text-periwinkle">
              {date} • {readTime} read
            </span>
          </div>

          {/* Title */}
          <h3 className="font-fenix text-2xl text-white mb-3">{title}</h3>

          {/* Description */}
          <p
            className="font-lato flex-grow mb-4 text-desc"
            style={{
              fontWeight: 400,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: 0,
            }}
          >
            {description}
          </p>

          {/* Tags */}
          <div className="flex items-center space-x-2 mb-4">
            {safeTags.map((tag, index) => (
              <span
                key={index}
                className="bg-chip text-periwinkle text-xs font-semibold px-3 py-1 rounded-xl"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author and actions */}
          <div className="flex justify-between items-center mt-auto">
            {/* Author - Using fetched profile data */}
            <div className="flex items-center space-x-3">
              {profileLoading ? (
                // Loading state for author
                <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
              ) : (
                <img
                  alt={authorInfo.name}
                  className="w-8 h-8 rounded-full object-cover"
                  src={authorInfo.avatar}
                  onError={(e) => {
                    // Fallback image if profile image fails to load
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorInfo.name)}&background=0D8ABC&color=fff`;
                  }}
                />
              )}
              <span className="font-lato text-periwinkle text-sm">
                {profileLoading ? "Loading..." : authorInfo.name}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 text-periwinkle">
              {/* Upvote */}
              <button
                onClick={toggleUpvote}
                className={`flex items-center text-sm transition-colors ${
                  isUpvoted ? "text-green-500" : "hover:text-white"
                }`}
              >
                <span className="material-icons text-base mr-1">
                  arrow_upward
                </span>
                {upvotes + (isUpvoted ? 1 : 0)}
              </button>

              {/* Downvote */}
              <button
                onClick={toggleDownvote}
                className={`flex items-center text-sm transition-colors ${
                  isDownvoted ? "text-red-400" : "hover:text-white"
                }`}
              >
                <span className="material-icons text-base mr-1">
                  arrow_downward
                </span>
                {downvotes + (isDownvoted ? 1 : 0)}
              </button>

              {/* Comments */}
              <button className="flex items-center text-sm hover:text-white transition-colors">
                <span className="material-icons text-base mr-1">
                  chat_bubble_outline
                </span>
                {comments}
              </button>

              {/* Views */}
              <span className="flex items-center text-sm hover:text-white transition-colors">
                <span className="material-icons text-base mr-1">visibility</span>
                {views}
              </span>
            </div>
          </div>

          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            disabled={saveLoading}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              isSaved
                ? "text-periwinkle"
                : "text-periwinkle hover:text-white"
            } ${saveLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="material-icons">
              {isSaved ? "bookmark" : "bookmark_border"}
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
