import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TextSelectionPopup from "./TextSelectionPopup";
import Comments from "./Comments";

export default function BlogDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [readingMode, setReadingMode] = useState("original");
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${postId}`);
        const data = res.data.post;
        setPost(data);
        setUpvotes(data.upvotes || 0);
        setDownvotes(data.downvotes || 0);
      } catch (error) {
        setErr(error?.response?.data?.error || "Failed to load post");
      }
      setLoading(false);
    };
    if (postId) fetchPost();
  }, [postId]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setPopupPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const toggleUpvote = () => {
    if (isUpvoted) {
      setUpvotes(upvotes - 1);
      setIsUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setIsUpvoted(true);
      if (isDownvoted) {
        setDownvotes(downvotes - 1);
        setIsDownvoted(false);
      }
    }
  };

  const toggleDownvote = () => {
    if (isDownvoted) {
      setDownvotes(downvotes - 1);
      setIsDownvoted(false);
    } else {
      setDownvotes(downvotes + 1);
      setIsDownvoted(true);
      if (isUpvoted) {
        setUpvotes(upvotes - 1);
        setIsUpvoted(false);
      }
    }
  };

  if (loading) return <div className="text-white text-center">Loading post...</div>;
  if (err) return <div className="text-red-400 text-center">{err}</div>;
  if (!post) return <div className="text-white text-center">No post found.</div>;

  // Select which content to show
  const contentToRender =
    readingMode === "simplify"
      ? post.simplified_description || post.post_description
      : post.post_description;

  return (
    <div className="min-h-screen bg-rich-black relative">
      {/* Glow background */}
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

      <div className="relative z-10 container mx-auto px-5 sm:px-7 lg:px-10 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section with Buttons and Search */}
          <div className="flex items-center justify-between mb-6">
            {/* Reading Mode Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setReadingMode("simplify")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-lato text-sm font-medium transition-all ${
                  readingMode === "simplify"
                    ? "bg-medium-slate-blue text-white shadow-lg shadow-medium-slate-blue/30"
                    : "bg-rich-black-light text-periwinkle hover:bg-periwinkle-light border border-navbar-border"
                }`}
              >
                <span className="material-icons text-lg">auto_fix_high</span>
                <span>Simplify</span>
              </button>
              <button
                onClick={() => setReadingMode("original")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-lato text-sm font-medium transition-all ${
                  readingMode === "original"
                    ? "bg-medium-slate-blue text-white shadow-lg shadow-medium-slate-blue/30"
                    : "bg-rich-black-light text-periwinkle hover:bg-periwinkle-light border border-navbar-border"
                }`}
              >
                <span className="material-icons text-lg">description</span>
                <span>Original</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search in article"
                className="bg-transparent border border-[#393B5A] text-white rounded-[8px] h-[49px] pl-12 pr-4 w-96 text-base focus:outline-none font-lato placeholder-periwinkle"
              />
              <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-periwinkle text-xl">
                search
              </span>
            </div>
          </div>

          {/* Community + Meta Info */}
          <div className="flex items-center text-sm mb-4 font-lato">
            <span className="text-periwinkle px-3 py-1 rounded-xl font-semibold border border-navbar-border">
              {post.community || "General"}
            </span>
            <span className="mx-2 text-periwinkle">·</span>
            <span className="text-periwinkle">
              {new Date(post.createdAt).toLocaleDateString()} • {post.read_time || "6 min"} read
            </span>
          </div>

          {/* Title */}
          <h1 className="font-fenix text-3xl md:text-4xl text-white mb-6 leading-tight">
            {post.post_title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={post.author?.avatar || "https://ui-avatars.com/api/?name=User"}
              alt={post.author?.name || "Author"}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="text-white font-lato font-medium text-base">
                {post.author?.name || "Unknown"}
              </div>
              <div className="text-periwinkle text-sm font-lato">Author</div>
            </div>
          </div>

          {/* Tags Below Author */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag, i) => (
              <span
                key={i}
                className="bg-chip text-periwinkle text-xs font-semibold px-3 py-1 rounded-xl font-lato"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.thumbnail}
                alt="Thumbnail"
                className="w-full h-80 object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div ref={contentRef} onMouseUp={handleTextSelection} className="mb-8">
            <div className="prose prose-invert max-w-none">
              <div
                className="text-white space-y-4 
                          prose-pre:bg-rich-black-light prose-pre:border prose-pre:border-navbar-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto 
                          prose-h2:text-3xl prose-h2:font-fenix prose-h2:font-bold prose-h2:text-white prose-h2:tracking-wide
                          prose-p:leading-snug prose-p:font-lato"
                dangerouslySetInnerHTML={{ __html: contentToRender }}
              />
            </div>
          </div>



          {/* Separator */}
          <hr className="border-navbar-border mb-8" />

          {/* Action Bar */}
<div className="flex items-center justify-between mb-8">
  <div className="flex items-center space-x-6">
    {/* Upvote */}
    <button
      onClick={toggleUpvote}
      className={`flex items-center space-x-2 transition-colors ${
        isUpvoted ? "text-green-400" : "text-periwinkle hover:text-white"
      }`}
    >
      <span className="material-icons text-lg">arrow_upward</span>
      <span className="font-lato font-medium">{upvotes}</span>
    </button>

    {/* Downvote */}
    <button
      onClick={toggleDownvote}
      className={`flex items-center space-x-2 transition-colors ${
        isDownvoted ? "text-red-400" : "text-periwinkle hover:text-white"
      }`}
    >
      <span className="material-icons text-lg">arrow_downward</span>
      <span className="font-lato font-medium">{downvotes}</span>
    </button>

    {/* Views */}
    <div className="flex items-center space-x-2 text-periwinkle">
      <span className="material-icons text-lg">visibility</span>
      <span className="font-lato font-medium">{post.views || 0}</span>
    </div>
  </div>

  {/* Share + Save */}
  <div className="flex items-center space-x-4">
    <button className="flex items-center space-x-2 px-4 py-2 border border-periwinkle text-periwinkle rounded-md hover:bg-periwinkle-light transition-colors font-lato">
      <span className="material-icons text-lg">share</span>
      <span>Share</span>
    </button>
    <button
      onClick={() => setIsBookmarked(!isBookmarked)}
      className="flex items-center space-x-2 px-4 py-2 border border-periwinkle text-periwinkle rounded-md hover:bg-periwinkle-light transition-colors font-lato"
    >
      <span className="material-icons text-lg">
        {isBookmarked ? "bookmark" : "bookmark_border"}
      </span>
      <span>{isBookmarked ? "Saved" : "Save"}</span>
    </button>
  </div>
</div>


          {/* Comments */}
          <Comments />
        </div>
      </div>

      {/* Text Selection Popup */}
      {showPopup && (
        <TextSelectionPopup
          position={popupPosition}
          selectedText={selectedText}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
