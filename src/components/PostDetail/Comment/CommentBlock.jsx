import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { forwardRef } from "react";
import InputField from "../../../shared/InputField";

dayjs.extend(relativeTime);

const CommentBlock = forwardRef(
  (
    {
      c,
      auth,
      triggerId,
      editingComment,
      setEditingComment,
      editingText,
      setEditingText,
      handleUpdateComment,
      replyingTo,
      setReplyingTo,
      reply,
      setReply,
      handleAddComment,
      handleLike,
      handleDislike,
      replies,
      expandReplies,
      setExpandReplies,
      handleReplies,
      handleDelete,
      isReply = false,
    },
    ref
  ) => (
    <div className="flex space-x-3">
      {/* Avatar outside the box */}
      <img
        src={c.user?.profileImage || "/default-avatar.png"}
        alt={c.user?.username || "Unknown User"}
        className={`${isReply ? "w-8 h-8" : "w-10 h-10"} rounded-full flex-shrink-0`}
      />

      {/* Comment Thread Box */}
      <div className="flex-1 bg-rich-black-light rounded-lg border border-navbar-border">
        {/* Main Comment */}
        <div className="p-4" ref={(el) => c._id === triggerId && (ref.current = el)}>
          {/* Editing Mode */}
          {editingComment[c._id] === c._id ? (
            <div className="flex items-start space-x-3">
              <textarea
                value={editingText[c._id] ?? ""}
                onChange={(e) =>
                  setEditingText((prev) => ({ ...prev, [c._id]: e.target.value }))
                }
                placeholder="Edit your comment..."
                className="flex-1 bg-rich-black-light border border-navbar-border rounded-lg px-4 py-3 text-white placeholder-periwinkle focus:outline-none focus:border-periwinkle resize-none font-lato text-sm min-h-[44px] max-h-32"
                rows="1"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateComment(c._id)}
                  className="bg-medium-slate-blue text-white px-4 py-2.5 rounded-md hover:bg-medium-slate-blue-dark transition-all duration-200 font-lato font-medium flex items-center justify-center min-w-[44px] shadow-lg shadow-medium-slate-blue/30"
                >
                  <span className="material-icons text-base">send</span>
                </button>
                <button
                  onClick={() => {
                    setEditingComment((prev) => ({ ...prev, [c._id]: "" }));
                    setEditingText((prev) => ({ ...prev, [c._id]: "" }));
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition font-lato text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-white font-medium font-lato text-sm">{c.user?.username || "Unknown User"}</span>
                <span className="text-periwinkle text-xs font-lato">{dayjs(c.createdAt).fromNow()}</span>
              </div>
              <p className="text-white text-sm font-lato leading-relaxed mb-3">{c.text}</p>
              
              {/* Comment Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(c._id, auth?.user?._id)}
                  className={`flex items-center space-x-1 text-xs transition-colors font-lato ${
                    c.likes?.includes(auth?.user?._id) ? "text-white" : "text-periwinkle hover:text-white"
                  }`}
                >
                  <span className="material-icons text-sm">thumb_up</span>
                  <span>{c.likes?.length || 0}</span>
                </button>
                <button
                  onClick={() => handleDislike(c._id, auth?.user?._id)}
                  className={`flex items-center space-x-1 text-xs transition-colors font-lato ${
                    c.dislikes?.includes(auth?.user?._id) ? "text-white" : "text-periwinkle hover:text-white"
                  }`}
                >
                  <span className="material-icons text-sm">thumb_down</span>
                  <span>{c.dislikes?.length || 0}</span>
                </button>
                <button
                  onClick={() => {
                    setReplyingTo((prev) => ({ ...prev, [c._id]: c._id }));
                    setReply((prev) => ({ ...prev, [c._id]: `@${c.user?.username || "Unknown"} ` }));
                  }}
                  className="flex items-center space-x-1 text-xs text-periwinkle hover:text-white transition-colors font-lato"
                >
                  <span className="material-icons text-sm">chat_bubble_outline</span>
                  <span>Reply</span>
                </button>
                {c.userId === auth?.user?._id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingText((prev) => ({ ...prev, [c._id]: c.text }));
                        setEditingComment((prev) => ({ ...prev, [c._id]: c._id }));
                      }}
                      className="flex items-center space-x-1 text-xs text-periwinkle hover:text-white transition-colors font-lato"
                    >
                      <span className="material-icons text-sm">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center space-x-1 text-xs text-periwinkle hover:text-red-400 transition-colors font-lato"
                    >
                      <span className="material-icons text-sm">delete</span>
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Reply Input */}
        {replyingTo[c._id] === c._id && (
          <div className="px-4 pb-4">
            <div className="flex items-start space-x-3">
              <textarea
                value={reply?.[c._id] ?? ""}
                onChange={(e) =>
                  setReply((prev) => ({ ...prev, [c._id]: e.target.value }))
                }
                placeholder="Write a reply..."
                className="flex-1 bg-rich-black-light border border-navbar-border rounded-lg px-4 py-3 text-white placeholder-periwinkle focus:outline-none focus:border-periwinkle resize-none font-lato text-sm min-h-[44px] max-h-32"
                rows="1"
              />
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleAddComment(e, c)}
                  className="bg-medium-slate-blue text-white px-4 py-2.5 rounded-md hover:bg-medium-slate-blue-dark transition-all duration-200 font-lato font-medium flex items-center justify-center min-w-[44px] shadow-lg shadow-medium-slate-blue/30"
                >
                  <span className="material-icons text-base">send</span>
                </button>
                <button
                  onClick={() => {
                    setReply((prev) => ({ ...prev, [c._id]: "" }));
                    setReplyingTo((prev) => ({ ...prev, [c._id]: null }));
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition font-lato text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View/Hide Replies */}
        {!isReply && c.replyCount > 0 && (
          <div className="px-4 pb-2">
            <button
              onClick={() =>
                expandReplies[c._id]
                  ? setExpandReplies((prev) => ({ ...prev, [c._id]: false }))
                  : handleReplies(c._id)
              }
              className="text-sm text-periwinkle hover:text-white transition-colors font-lato"
            >
              {expandReplies[c._id] ? "Hide Replies" : `View Replies (${c.replyCount})`}
            </button>
          </div>
        )}

        {/* Replies */}
        {expandReplies[c._id] && replies[c._id] && (
          <div className="pt-4 pl-16 pr-4 pb-4 relative">
            {/* Vertical line */}
            <div className="absolute left-12 top-0 bottom-4 w-px bg-gray-600"></div>
            
            {replies[c._id]?.map((replyComment) => (
              <div key={replyComment._id} className="flex space-x-3 pb-4">
                <img
                  src={replyComment.user?.profileImage || "/default-avatar.png"}
                  alt={replyComment.user?.username || "Unknown User"}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0" ref={replyComment._id === triggerId ? ref : null}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-white font-medium font-lato text-sm">{replyComment.user?.username || "Unknown User"}</span>
                    <span className="text-periwinkle text-xs font-lato">{dayjs(replyComment.createdAt).fromNow()}</span>
                  </div>
                  <p className="text-white text-sm font-lato leading-relaxed mb-3">{replyComment.text}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(replyComment._id, auth?.user?._id)}
                      className={`flex items-center space-x-1 text-xs transition-colors font-lato ${
                        replyComment.likes?.includes(auth?.user?._id) ? "text-white" : "text-periwinkle hover:text-white"
                      }`}
                    >
                      <span className="material-icons text-sm">thumb_up</span>
                      <span>{replyComment.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => handleDislike(replyComment._id, auth?.user?._id)}
                      className={`flex items-center space-x-1 text-xs transition-colors font-lato ${
                        replyComment.dislikes?.includes(auth?.user?._id) ? "text-white" : "text-periwinkle hover:text-white"
                      }`}
                    >
                      <span className="material-icons text-sm">thumb_down</span>
                      <span>{replyComment.dislikes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo((prev) => ({ ...prev, [c._id]: c._id }));
                        setReply((prev) => ({ ...prev, [c._id]: `@${replyComment.user?.username || "Unknown"} ` }));
                      }}
                      className="flex items-center space-x-1 text-xs text-periwinkle hover:text-white transition-colors font-lato"
                    >
                      <span className="material-icons text-sm">chat_bubble_outline</span>
                      <span>Reply</span>
                    </button>
                    {replyComment.userId === auth?.user?._id && (
                      <button
                        onClick={() => handleDelete(replyComment._id)}
                        className="flex items-center space-x-1 text-xs text-periwinkle hover:text-red-400 transition-colors font-lato"
                      >
                        <span className="material-icons text-sm">delete</span>
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
);

export default CommentBlock;
