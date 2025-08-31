import React from "react";
import ActionButton from "../../shared/ActionButton";

const PostFormCard = () => {
  return (
    <div className="bg-navbar-bg border border-navbar-border rounded-2xl p-6 flex flex-col gap-6 w-full">
      {/* Title */}
      <div>
        <label className="block text-white font-fenix mb-2">Post Title</label>
        <input
          type="text"
          placeholder="Enter a catchy title for your post"
          className="w-full bg-transparent border border-navbar-border rounded-lg px-4 py-2 text-white placeholder:text-desc focus:outline-none focus:border-periwinkle"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-white font-fenix mb-2">Your Content</label>
        <textarea
          placeholder="Start writing your masterpiece..."
          rows={8}
          className="w-full bg-transparent border border-navbar-border rounded-lg px-4 py-2 text-white placeholder:text-desc focus:outline-none focus:border-periwinkle"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-white font-fenix mb-2">Cover Image</label>
        <div className="border border-dashed border-navbar-border rounded-lg p-6 text-center text-desc cursor-pointer hover:border-periwinkle transition">
          <span className="material-icons text-3xl block mb-2 text-periwinkle">image</span>
          <p>Drag & drop an image here, or browse</p>
          <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-white font-fenix mb-2">Tags</label>
        <input
          type="text"
          placeholder="Add up to 5 tags (e.g., #webdev, #react)"
          className="w-full bg-transparent border border-navbar-border rounded-lg px-4 py-2 text-white placeholder:text-desc focus:outline-none focus:border-periwinkle"
        />
        <p className="text-xs text-desc mt-1">Separate tags with commas.</p>
      </div>

      {/* Community Select */}
      <div>
        <label className="block text-white font-fenix mb-2">Select a Community</label>
        <select className="w-full bg-transparent border border-navbar-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-periwinkle">
          <option className="bg-rich-black text-white">Next.js Devs</option>
          <option className="bg-rich-black text-white">Game Designers</option>
          <option className="bg-rich-black text-white">AI Enthusiasts</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <ActionButton variant="secondary">Save Draft</ActionButton>
        <ActionButton variant="primary">Publish</ActionButton>
      </div>
    </div>
  );
};

export default PostFormCard;
