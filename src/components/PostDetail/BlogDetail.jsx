import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VoteButtons from "./VoteButtons";

export default function BlogDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState("original"); // simplify | original

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${postId}`);
        setPost(res.data.post || null);
      } catch (error) {
        setErr(error?.response?.data?.error || "Failed to load post");
      }
      setLoading(false);
    };

    if (postId) fetchPost();
  }, [postId]);

  if (loading) return <div className="text-white text-center">Loading post...</div>;
  if (err) return <div className="text-red-400 text-center">{err}</div>;
  if (!post) return <div className="text-white text-center">No post found.</div>;

  return (
    <article className="max-w-4xl mx-auto">
      {/* Simplify / Original */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("simplify")}
            className={`px-3 py-1 rounded-md text-sm border transition ${
              mode === "simplify"
                ? "bg-periwinkle-dark text-rich-black border-periwinkle"
                : "text-columbia-blue border-periwinkle-light"
            }`}
          >
            Simplify
          </button>
          <button
            onClick={() => setMode("original")}
            className={`px-3 py-1 rounded-md text-sm border transition ${
              mode === "original"
                ? "bg-periwinkle-dark text-rich-black border-periwinkle"
                : "text-columbia-blue border-periwinkle-light"
            }`}
          >
            Original
          </button>
        </div>
        <button className="text-periwinkle hover:text-white p-2 rounded-md border border-transparent hover:bg-white/5 transition">
          <span className="material-icons">bookmark_border</span>
        </button>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-3 mb-3">
        {post.tags?.map((tag, i) => (
          <span key={i} className="bg-chip text-periwinkle px-3 py-1 rounded-full text-xs">
            #{tag}
          </span>
        ))}
        <span className="text-columbia-blue text-sm ml-3">
          {new Date(post.createdAt).toLocaleDateString()} · {post.read_time || "6 min"} read
        </span>
      </div>

      {/* Title */}
      <h1 className="font-fenix text-4xl text-white leading-tight mb-4">
        {post.post_title}
      </h1>

      {/* Author */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={post.author?.avatar || "https://ui-avatars.com/api/?name=User"}
          alt="Author"
          className="w-12 h-12 rounded-full border"
        />
        <div>
          <div className="text-white font-semibold">{post.author?.name || "Unknown"}</div>
          <div className="text-desc text-sm">Author</div>
        </div>
      </div>

      {/* Hero Image */}
      {post.thumbnail && (
        <div className="mb-8">
          <img
            src={post.thumbnail}
            alt="hero"
            className="w-full max-h-[400px] object-cover rounded-xl"
          />
        </div>
      )}

      {/* Blog Content */}
      <div
        className="prose prose-invert max-w-none space-y-6 text-desc
                   prose-headings:text-white prose-pre:bg-rich-black-light
                   prose-pre:border prose-pre:border-periwinkle-light prose-pre:rounded-xl
                   prose-pre:p-5 prose-pre:text-sm prose-code:text-periwinkle-light"
        dangerouslySetInnerHTML={{ __html: post.post_description || "" }}
      />

      {/* Action Row */}
      <div className="flex items-center justify-between mt-6">
        <VoteButtons initialUp={post.upvotes || 0} initialDown={post.downvotes || 0} />
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rich-black-light border border-periwinkle-light hover:bg-card-button-hover-bg transition">
            <span className="material-icons">share</span>
            <span className="text-columbia-blue">Share</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rich-black-light border border-periwinkle-light hover:bg-card-button-hover-bg transition">
            <span className="material-icons">bookmark</span>
            <span className="text-columbia-blue">Save</span>
          </button>
        </div>
      </div>
    </article>
  );
}
