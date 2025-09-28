import React, { useState, useEffect } from "react";
import SearchBar from "../../shared/SearchBar";
import BlogCard from "../BlogListing/BlogCard";
import { getHistory, searchHistory, clearHistory } from "../../api/curationApi";

const HistoryPage = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getHistory(page);
      setHistoryItems(response.data.history);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const handleSearch = async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        return fetchHistory();
      }
      setLoading(true);
      const response = await searchHistory(searchTerm);
      setHistoryItems(response.data.history);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      setLoading(true);
      await clearHistory();
      setHistoryItems([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (error) {
    return (
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <div className="text-center">
          <span className="material-icons text-6xl text-red-500 mb-4 block">
            error
          </span>
          <h3 className="font-fenix text-2xl text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-columbia-blue">{error}</p>
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
                History
              </h1>
              <p className="text-desc text-base">
                Your recently viewed posts
              </p>
            </div>
            
            {/* Search Bar and Clear Button */}
            <div className="flex items-center gap-4 w-full md:w-[500px]">
              <SearchBar onSearch={handleSearch} />
              {historyItems.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 text-columbia-blue hover:text-white transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>
          </div>
        </div>

        {/* History Items Grid */}
        {loading ? (
          <div className="text-center py-16">
            <span className="material-icons text-6xl text-columbia-blue animate-spin">
              refresh
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            {historyItems.map((item) => (
              <BlogCard
                key={item._id}
                image={item.image}
                community={item.community}
                date={new Date(item.viewedAt).toLocaleDateString()}
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
            {historyItems.length === 0 && (
              <div className="text-center py-16">
                <span className="material-icons text-6xl text-columbia-blue mb-4 block">
                  history
                </span>
                <h3 className="font-fenix text-2xl text-white mb-2">
                  No history yet
                </h3>
                <p className="text-columbia-blue">
                  Start reading posts to see your history here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;