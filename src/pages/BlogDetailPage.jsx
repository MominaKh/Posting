import React from "react";
import SearchBar from "../shared/SearchBar";
import BlogDetail from "../components/PostDetail/BlogDetail";
import Comments from "../components/PostDetail/Comments";
import Navbar from "../shared/Navbar";
export default function BlogDetailPage() {
  return (
    <div className="bg-rich-black min-h-screen relative overflow-hidden text-white">
      {/* Gradient glow */}
      <div
        className="absolute z-0"
        style={{
          width: 637,
          height: 300,
          top: -38,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1A1842B3",
          filter: "blur(120px)",
          borderRadius: 30,
          pointerEvents: "none",
        }}
      />
    
        <Navbar />
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">

        {/* Blog + Comments */}
        <BlogDetail />
        <Comments />
      </div>
    </div>
  );
}
