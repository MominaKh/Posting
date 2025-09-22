import React, { useState } from "react";

/**
 * Comments component.
 * Renders comment input and a list of comments with nested replies.
 */
export default function Comments() {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "John Smith",
      date: "Mar 12, 2025",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Great article! I've been using Next.js for a few months now and it's drastically improved my workflow.",
      upvotes: 12,
    },
    {
      id: 2,
      name: "Sarah Kim",
      date: "Mar 11, 2025",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Thanks for explaining the file-based routing so clearly. I was confused about how to set up dynamic routes, but this helps.",
      upvotes: 5,
      reply: {
        name: "David Lee",
        date: "Mar 12, 2025",
        avatar: "https://randomuser.me/api/portraits/men/36.jpg",
        text: "@sarahkim I appreciate it!",
        upvotes: 12,
      },
    },
  ]);

  const [newComment, setNewComment] = useState("");

  function addComment() {
    if (!newComment.trim()) return;
    const c = {
      id: Date.now(),
      name: "You",
      date: new Date().toLocaleDateString(),
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      text: newComment,
      upvotes: 0,
    };
    setComments((s) => [c, ...s]);
    setNewComment("");
  }

  return (
    <section className="max-w-4xl mx-auto mt-10">
      <h3 className="font-fenix text-xl text-white mb-4">Comments ({comments.length})</h3>

      {/* input */}
      <div className="flex items-start gap-3 mb-6">
        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="you" className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            placeholder="Add a comment.."
            className="w-full bg-rich-black-light border border-navbar-border rounded-lg px-3 py-2 text-columbia-blue placeholder-columbia-blue focus:outline-none"
          />
        </div>
        <button
          onClick={addComment}
          className="ml-2 bg-medium-slate-blue hover:bg-medium-slate-blue-dark text-white px-4 py-2 rounded-lg"
          aria-label="Post comment"
        >
          <span className="material-icons leading-none align-middle">send</span>
        </button>
      </div>

      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="bg-rich-black-light border border-periwinkle-light rounded-xl p-4">
            <div className="flex items-start gap-3">
              <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-periwinkle">{c.name}</div>
                    <div className="text-sm text-desc">{c.date}</div>
                  </div>
                  <div className="text-sm text-columbia-blue"> {/* upvotes */}
                    <span className="material-icons text-base align-middle mr-1">arrow_upward</span>
                    {c.upvotes}
                  </div>
                </div>

                <p className="mt-3 text-columbia-blue">{c.text}</p>

                {c.reply && (
                  <div className="mt-4 ml-12 border-l-2 border-periwinkle-light pl-4">
                    <div className="flex items-start gap-3">
                      <img src={c.reply.avatar} alt={c.reply.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="font-semibold text-periwinkle">{c.reply.name} <span className="text-sm text-desc ml-2">{c.reply.date}</span></div>
                        <p className="mt-2 text-columbia-blue">{c.reply.text}</p>
                        <div className="text-sm text-columbia-blue mt-2">
                          <span className="material-icons text-base align-middle mr-1">arrow_upward</span>
                          {c.reply.upvotes}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
