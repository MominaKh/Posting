import React, { useState } from "react";
import { Link } from "react-router-dom";

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
  bookmarked = false,
}) => {
  // State for toggles
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);

  // Handlers
  const toggleBookmark = (e) => {
    e.preventDefault(); // prevent navigation
    setIsBookmarked(!isBookmarked);
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

  // Ensure author object exists and has required properties
  const safeAuthor = {
    name: author?.name || "Unknown",
    avatar:
      author?.avatar ||
      "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff",
  };

  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <Link
      to={`/post/${id}`}
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
            {/* Author */}
            <div className="flex items-center space-x-3">
              <img
                alt={safeAuthor.name}
                className="w-8 h-8 rounded-full"
                src={safeAuthor.avatar}
              />
              <span className="font-lato text-periwinkle text-sm">
                {safeAuthor.name}
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
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              isBookmarked
                ? "text-periwinkle"
                : "text-periwinkle hover:text-white"
            }`}
          >
            <span className="material-icons">
              {isBookmarked ? "bookmark" : "bookmark_border"}
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
