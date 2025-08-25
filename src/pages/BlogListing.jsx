import React from "react";
import Navbar from "../shared/Navbar";

export default function BlogListing() {
  return (
    <div className="min-h-screen bg-rich-black">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {/* Your blog cards go here */}
        <h2 className="text-white font-fenix text-3xl mb-8">Blog Listing</h2>
        {/* ... */}
      </main>
    </div>
  );
}