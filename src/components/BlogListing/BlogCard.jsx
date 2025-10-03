import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../api/ProfileApi";
import { useSavePost } from "../../hooks/useSavePost";
import { recordView, unsavePost } from "../../api/curationApi";

const BlogCard = ({
  id,
  image,
  community,
  date,
  readTime,
  title,
  description,
  tags = [],
  author = { name: "Unknown", avatar: "" },
  upvotes = 0,
  downvotes = 0,
  comments = 0,
  views = 0,
  user_id,
}) => {
  const navigate = useNavigate();
  
  // State for toggles
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  
  // State for user profile
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Bookmark state
  const [showBookmarkMenu, setShowBookmarkMenu] = useState(false);
  const { isSaved, category, isLoading: saveLoading, toggleSave, updateCategory } = useSavePost(id);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (user_id) {
        try {
          const profile = await getProfile(user_id);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [user_id]);

  const authorInfo = userProfile || author;

  const handleCardClick = async (e) => {
    // Don't navigate if clicking on bookmark area
    if (e.target.closest('.bookmark-action-area')) {
      return;
    }
    
    // Record view
    try {
      await recordView(id);
    } catch (error) {
      console.error("Error recording view:", error);
    }
    
  navigate(`/post/${id}`);
  };

  const toggleUpvote = (e) => {
    e.stopPropagation();
    setIsUpvoted(!isUpvoted);
    if (isDownvoted) setIsDownvoted(false);
  };

  const toggleDownvote = (e) => {
    e.stopPropagation();
    setIsDownvoted(!isDownvoted);
    if (isUpvoted) setIsUpvoted(false);
  };

  const handleBookmarkMenu = (e) => {
    e.stopPropagation();
    setShowBookmarkMenu(!showBookmarkMenu);
  };



  const handleSave = async (cat) => {
    if (isSaved && category !== cat) {
      await updateCategory(cat);
      if (typeof onSavedChange === 'function') onSavedChange();
    } else if (!isSaved) {
      await toggleSave(cat);
      if (typeof onSavedChange === 'function') onSavedChange();
    }
    setShowBookmarkMenu(false);
  };

  const handleUnsave = async () => {
    try {
      await toggleSave();
      if (typeof onSavedChange === 'function') onSavedChange(id);
      setShowBookmarkMenu(false);
    } catch (error) {
      console.error("Error unsaving post:", error);
    }
  };

  return (
    <div
      className="block bg-navbar-bg rounded-xl overflow-hidden border z-0 hover:bg-white/5 transition"
      style={{ border: "1px solid var(--navbar-border)" }}
      onClick={handleCardClick}
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
            {tags.map((tag, index) => (
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
            {/* Author */}
            <div className="flex items-center space-x-3">
              {profileLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
              ) : (
                <img
                  alt={authorInfo.name}
                  className="w-8 h-8 rounded-full object-cover"
                  src={authorInfo.profileImage || authorInfo.avatar}
                  onError={(e) => {
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
              <button
                onClick={toggleUpvote}
                className={`flex items-center text-sm transition-colors ${
                  isUpvoted ? "text-green-500" : "hover:text-white"
                }`}
              >
                <span className="material-icons text-base mr-1">arrow_upward</span>
                {upvotes + (isUpvoted ? 1 : 0)}
              </button>
              <button
                onClick={toggleDownvote}
                className={`flex items-center text-sm transition-colors ${
                  isDownvoted ? "text-red-400" : "hover:text-white"
                }`}
              >
                <span className="material-icons text-base mr-1">arrow_downward</span>
                {downvotes + (isDownvoted ? 1 : 0)}
              </button>
              <button className="flex items-center text-sm hover:text-white transition-colors">
                <span className="material-icons text-base mr-1">chat_bubble_outline</span>
                {comments}
              </button>
              <span className="flex items-center text-sm hover:text-white transition-colors">
                <span className="material-icons text-base mr-1">visibility</span>
                {views}
              </span>
            </div>
          </div>

          {/* Bookmark Dropdown */}
          <div className="absolute top-4 right-4 bookmark-action-area" onClick={e => e.stopPropagation()}>
            <button
              onClick={handleBookmarkMenu}
              disabled={saveLoading}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? "text-periwinkle" : "text-periwinkle hover:text-white"
              } ${saveLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="material-icons">
                {isSaved ? "bookmark" : "bookmark_border"}
              </span>
            </button>
            {showBookmarkMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-rich-black border border-navbar-border rounded-lg shadow-lg z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-periwinkle-light text-white"
                  onClick={e => { e.stopPropagation(); handleSave('Saved'); }}
                  disabled={saveLoading || (isSaved && category === 'Saved')}
                >
                  Save
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-periwinkle-light text-white"
                  onClick={e => { e.stopPropagation(); handleSave('Watch Later'); }}
                  disabled={saveLoading || (isSaved && category === 'Watch Later')}
                >
                  Watch Later
                </button>
                {isSaved && (
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-red-500 text-white"
                    onClick={e => { e.stopPropagation(); handleUnsave(); }}
                    disabled={saveLoading}
                  >
                    Unsave
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;