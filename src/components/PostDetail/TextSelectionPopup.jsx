import React, { useState, useEffect } from "react";

const TextSelectionPopup = ({ position, selectedText, onClose }) => {
  const [activeTab, setActiveTab] = useState("meaning");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.popup-content')) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Mock data 
  const meaningData = {
    word: selectedText.split(' ')[0],
    definition: "A powerful React framework that enables server-side rendering and static site generation for building modern web applications.",
    pronunciation: "/ˈnekst dɒt dʒeɪ es/",
    partOfSpeech: "noun"
  };

  const relatedBlogs = [
    {
      title: "Getting Started with React Server Components",
      snippet: "Learn how to use React Server Components in Next.js applications...",
      readTime: "4 min read"
    },
    {
      title: "TypeScript Best Practices for React",
      snippet: "Essential TypeScript patterns and practices for React developers...",
      readTime: "6 min read"
    },
    {
      title: "Building Full-Stack Apps with Next.js",
      snippet: "Complete guide to building full-stack applications using Next.js...",
      readTime: "8 min read"
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      style={{ display: showContent ? 'block' : 'none' }}
    >
      <div
  className="popup-content fixed bg-navbar-bg border border-navbar-border rounded-xl shadow-2xl w-96 max-w-sm 
             top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-navbar-border">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-periwinkle">auto_fix_high</span>
            <h3 className="font-semibold text-white">Smart Lookup</h3>
          </div>
          <button
            onClick={onClose}
            className="text-periwinkle hover:text-white p-1 rounded-lg hover:bg-periwinkle-light transition-colors"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Selected Text Display */}
        <div className="p-4 bg-rich-black-light border-b border-navbar-border">
          <p className="text-periwinkle text-sm font-semibold mb-1">Selected Text:</p>
          <p className="text-white italic">"{selectedText}"</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-navbar-border">
          <button
            onClick={() => setActiveTab("meaning")}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "meaning"
                ? "text-white bg-medium-slate-blue"
                : "text-periwinkle hover:bg-periwinkle-light"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="material-icons text-lg">book</span>
              <span>Meaning</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "search"
                ? "text-white bg-medium-slate-blue"
                : "text-periwinkle hover:bg-periwinkle-light"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="material-icons text-lg">search</span>
              <span>Search</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "blogs"
                ? "text-white bg-medium-slate-blue"
                : "text-periwinkle hover:bg-periwinkle-light"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="material-icons text-lg">article</span>
              <span>Blogs</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 max-h-80 overflow-y-auto">
          {activeTab === "meaning" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-periwinkle font-semibold text-lg mb-2">
                  {meaningData.word}
                  <span className="text-sm font-normal ml-2 text-celadon">
                    {meaningData.partOfSpeech}
                  </span>
                </h4>
                <p className="text-periwinkle/80 text-sm mb-3">
                  {meaningData.pronunciation}
                </p>
                <p className="text-white leading-relaxed">
                  {meaningData.definition}
                </p>
              </div>
              
              <div className="pt-4 border-t border-navbar-border">
                <button className="w-full bg-medium-slate-blue text-white py-2 px-4 rounded-lg hover:bg-medium-slate-blue-dark transition-colors flex items-center justify-center space-x-2">
                  <span className="material-icons text-lg">volume_up</span>
                  <span>Pronounce</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "search" && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  defaultValue={selectedText}
                  className="w-full bg-rich-black-light border border-navbar-border rounded-lg px-4 py-3 text-white placeholder-periwinkle focus:outline-none focus:border-periwinkle"
                  placeholder="Search..."
                />
                <button className="absolute right-3 top-3 text-periwinkle hover:text-white">
                  <span className="material-icons">search</span>
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-rich-black-light rounded-lg p-3 border border-navbar-border">
                  <div className="flex items-start space-x-3">
                    <div className="bg-medium-slate-blue p-2 rounded-lg flex-shrink-0">
                      <span className="material-icons text-white">smart_toy</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-periwinkle font-semibold text-sm mb-1">AI Assistant</p>
                      <p className="text-white text-sm">
                        Next.js is a popular React framework that provides server-side rendering, 
                        static site generation, and many other features out of the box...
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-celadon text-rich-black py-2 px-4 rounded-lg hover:bg-celadon-dark transition-colors font-semibold">
                  Get Detailed Answer
                </button>
              </div>
            </div>
          )}

          {activeTab === "blogs" && (
            <div className="space-y-4">
              <h4 className="text-periwinkle font-semibold mb-3">Related Articles</h4>
              {relatedBlogs.map((blog, index) => (
                <div
                  key={index}
                  className="bg-rich-black-light rounded-lg p-3 border border-navbar-border hover:border-periwinkle transition-colors cursor-pointer"
                >
                  <h5 className="text-white font-semibold text-sm mb-2">
                    {blog.title}
                  </h5>
                  <p className="text-periwinkle/80 text-xs mb-2">
                    {blog.snippet}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-celadon text-xs">{blog.readTime}</span>
                    <span className="material-icons text-periwinkle text-sm">
                      arrow_forward
                    </span>
                  </div>
                </div>
              ))}
              
              <button className="w-full bg-periwinkle text-rich-black py-2 px-4 rounded-lg hover:bg-periwinkle-dark transition-colors font-semibold">
                View All Related
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextSelectionPopup;