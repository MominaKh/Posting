import React, { useState, useEffect } from "react";
import SavedFilterBar from "./SavedFilterBar";
import SearchBar from "../../shared/SearchBar";
import BlogCard from "../BlogListing/BlogCard";
import { getSavedPosts, searchSavedPosts } from "../../api/curationApi";

const SavedPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Items");
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const filters = ["All Items", "Unread", "Watch Later"];

  useEffect(() => {
    fetchSavedPosts();
  }, [selectedFilter]);

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const category = selectedFilter === "Watch Later" ? "Watch Later" : 
                      selectedFilter === "All Items" ? null : selectedFilter;
      const response = await getSavedPosts(category);
      setSavedItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        return fetchSavedPosts();
      }
      setLoading(true);
      const category = selectedFilter === "Watch Later" ? "Watch Later" :
                      selectedFilter === "All Items" ? null : selectedFilter;
      const response = await searchSavedPosts(searchTerm, category);
      setSavedItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-rich-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-columbia-blue">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchSavedPosts();
            }}
            className="mt-4 text-columbia-blue hover:text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div>
              <h1 className="font-fenix text-[28px] text-white mb-1">
                Saved Items
              </h1>
              <p className="text-desc text-base">
                Your collection of saved posts
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center gap-4 w-full md:w-[500px]">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedFilter === filter
                    ? "bg-columbia-blue text-rich-black"
                    : "text-columbia-blue hover:bg-columbia-blue/10"
                }`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Items Grid */}
        {loading ? (
          <div className="text-center py-16">
            <span className="material-icons text-6xl text-columbia-blue animate-spin">
              refresh
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            {savedItems.map((item) => (
              <BlogCard
                key={item._id}
                image={item.image}
                community={item.community}
                date={new Date(item.savedAt).toLocaleDateString()}
                readTime={item.readTime}
                title={item.title}
                description={item.description}
                tags={item.tags}
                author={item.author}
                upvotes={item.upvotes}
                downvotes={item.downvotes}
                comments={item.comments}
                views={item.views}
                postId={item.postId}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && savedItems.length === 0 && (
          <div className="text-center py-16">
            <span className="material-icons text-6xl text-columbia-blue mb-4 block">
              bookmark
            </span>
            <h3 className="font-fenix text-2xl text-white mb-2">
              No saved items yet
            </h3>
            <p className="text-columbia-blue">
              Start saving posts to view them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;