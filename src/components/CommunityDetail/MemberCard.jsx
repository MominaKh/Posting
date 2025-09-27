import React from "react";

const MemberCard = ({ 
  id,
  name = "Unknown User",
  avatar = "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff",
  username = "",
  isAdmin = false,
  isModerator = false,
  loading = false
}) => {
  
  const handleViewProfile = () => {
    // Navigate to user profile page (implement based on your routing)
    console.log('View profile for user:', id);
    // navigate(`/profile/${id}`);
  };

  // Determine role badge
  const getRoleBadge = () => {
    if (isAdmin) {
      return {
        text: "Admin",
        bgColor: "bg-red-500/20",
        textColor: "text-red-400",
        borderColor: "border-red-500/30"
      };
    } else if (isModerator) {
      return {
        text: "Moderator",
        bgColor: "bg-yellow-500/20",
        textColor: "text-yellow-400",
        borderColor: "border-yellow-500/30"
      };
    } else {
      return {
        text: "Member",
        bgColor: "bg-periwinkle/20",
        textColor: "text-periwinkle",
        borderColor: "border-periwinkle/30"
      };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="bg-navbar-bg rounded-xl p-4 border border-navbar-border hover:border-periwinkle transition-colors">
      <div className="flex items-start gap-3">
        {/* Profile Image */}
        {loading ? (
          <div className="w-12 h-12 rounded-full bg-gray-600 animate-pulse flex-shrink-0"></div>
        ) : (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;
            }}
          />
        )}
        
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="text-white font-medium text-sm mb-1 truncate">
            {loading ? "Loading..." : name}
          </h3>

          {/* Username */}
          {username && !loading && (
            <p className="text-desc text-xs mb-2 truncate">
              @{username}
            </p>
          )}

          {/* Role Badge */}
          {!loading && (
            <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${roleBadge.bgColor} ${roleBadge.textColor} border ${roleBadge.borderColor}`}>
              <span className="material-icons text-xs mr-1">
                {isAdmin ? "admin_panel_settings" : isModerator ? "shield" : "person"}
              </span>
              {roleBadge.text}
            </div>
          )}
        </div>

        {/* View Profile Button (Icon Only) */}
        <button
          onClick={handleViewProfile}
          disabled={loading}
          className="text-periwinkle hover:text-white transition-colors p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          title="View Profile"
        >
          <span className="material-icons text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default MemberCard;