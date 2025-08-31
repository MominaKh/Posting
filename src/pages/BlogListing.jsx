import React, { useState } from "react";
import SearchBar from "../shared/SearchBar";
import NewPostButton from "../shared/NewPostButton";
import Navbar from "../shared/Navbar";
import BlogCard from "../components/BlogListing/BlogCard";
import BlogFilterBar from "../components/BlogListing/BlogFilterBar";
import PopularTags from "../components/BlogListing/PopularTags";
import PopularCommunities from "../components/BlogListing/PopularCommunties";
import UpcomingEvents from "../components/BlogListing/UpcomingEvents";

// Dummy Blogs
const DUMMY_BLOGS = [
  {
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    community: "Next.js Devs",
    date: "Mar 10, 2025",
    readTime: "6 min",
    title:
      "Building Modern Web Applications with Next.js and the TypeScript",
    description:
      "Learn how to leverage the power of Next.js and TypeScript to create robust, type-safe web applications with excellent developer experience.",
    tags: ["Next.js", "Typescript", "WebDevelopment"],
    author: {
      name: "Alex Johnson",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCGFljVK_1YLiLqNE8SMU0zsD2LUOv_ZJClfdq_DWp5FLd8KsDvQMnl0VOe2aFfU8eqc6M6I9aJ-VCGtFzHlUS0P9bjYnTWHMI5UO-pnf_7H4DGlvVnCe8Bj212iSAhJEonp7QjXn4VZAVbIpKHMYo4M70ouLkfY0wZPHju90a2vQzdL6Es79mMQ8NwXMHcJmqQaWhUuBwfkisr2uii-p0d3iFFfq4_RPcfykChX-MAS__NVdhAo3TLJvD4_LSMPxI_TLnrD1Gi_oFK",
    },
    upvotes: 142,
    downvotes: 12,
    comments: 24,
    views: 1850,
    bookmarked: false,
  },
  {
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    community: "Next.js Devs",
    date: "Mar 10, 2025",
    readTime: "6 min",
    title:
      "Building Modern Web Applications with Next.js and the TypeScript",
    description:
      "Learn how to leverage the power of Next.js and TypeScript to create robust, type-safe web applications with excellent developer experience.",
    tags: ["Next.js", "Typescript", "WebDevelopment"],
    author: {
      name: "Alex Johnson",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC0SOH_qdug48AdwWxvlB89VAMgWwLvCzU5nSDeh7sGBOxfcwtoGxXGFu3Q2JauQZWpKqk-GCgCttE6cJIsPEkbYBWNgz8qS6HIT-5Sz6LgHkDAzWnkSvAOUOk7CDaVV0qGaLh5TF5SZPN1EfhhvDKzelBH3komHVKuAU_sLPUdP82-LnV5uJEpBfaz0d1ZudZEkDGu7GEHq46ftKnljIDa0wEpEPuusxbFSIsOPoONgMi3EDnu1Bupe8IbBw6vKFxxdMaP6_2s5fii",
    },
    upvotes: 142,
    downvotes: 8,
    comments: 24,
    views: 1850,
    bookmarked: false,
  },
  {
    image:
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=600&q=80",
    community: "Next.js Devs",
    date: "Mar 10, 2025",
    readTime: "6 min",
    title:
      "Building Modern Web Applications with Next.js and the TypeScript",
    description:
      "Learn how to leverage the power of Next.js and TypeScript to create robust, type-safe web applications with excellent developer experience.",
    tags: ["Next.js", "Typescript", "WebDevelopment"],
    author: {
      name: "Alex Johnson",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC0SOH_qdug48AdwWxvlB89VAMgWwLvCzU5nSDeh7sGBOxfcwtoGxXGFu3Q2JauQZWpKqk-GCgCttE6cJIsPEkbYBWNgz8qS6HIT-5Sz6LgHkDAzWnkSvAOUOk7CDaVV0qGaLh5TF5SZPN1EfhhvDKzelBH3komHVKuAU_sLPUdP82-LnV5uJEpBfaz0d1ZudZEkDGu7GEHq46ftKnljIDa0wEpEPuusxbFSIsOPoONgMi3EDnu1Bupe8IbBw6vKFxxdMaP6_2s5fii",
    },
    upvotes: 142,
    downvotes: 16,
    comments: 24,
    views: 1850,
    bookmarked: false,
  },
];

// Filters
const FILTERS = ["All", "Popular", "Newest"];

const BlogListing = () => {
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);

  return (
    <div className="min-h-screen bg-rich-black flex flex-col relative">
      <Navbar />

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
      {/* Header */}
<div className="w-full flex justify-center pt-8 pb-6 px-4 sm:px-6 lg:px-8 relative z-10">
  {/* Blurred Background Glow */}
  <div className="w-full max-w-7xl z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    {/* Row 1: Title */}
    <h2 className="font-fenix text-[28px] text-white font-normal text-center md:text-left">
      Your Feed
    </h2>

    {/* Row 2: Search + Post */}
    <div className="flex justify-center items-center gap-2 w-full md:flex-1 md:justify-center md:px-12">
      <SearchBar className="flex-1 max-w-xs sm:max-w-md" />
      <NewPostButton />
    </div>
  </div>
</div>


      {/* Content */}
      <div className="w-full flex justify-center px-4 lg:px-8">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
          {/* Left Column - Blog Feed */}
          <div className="flex-1 lg:max-w-3xl">
            {/* Filter */}
            <div className="mb-6">
              <BlogFilterBar
              filters={FILTERS}          // ✅ pass filters array
              selected={selectedFilter}
              onSelect={setSelectedFilter}
            />
            </div>
            <div className="flex flex-col gap-7 pb-12">
              {DUMMY_BLOGS.map((blog, i) => (
                <BlogCard key={i} {...blog} />
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 flex flex-col gap-6">
            <PopularTags />
            <PopularCommunities />
            <UpcomingEvents />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogListing;
