import React, { useState } from "react";
import { useAuth } from "../context/auth";
import { useProfile } from "../context/profileContext";
import Logo from "../assets/BytehiveLogo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { auth } = useAuth(); // Use auth context
  const { profile, loading: profileLoading } = useProfile(); // Use profile context

  // Get profile image with fallback
  const getProfileImage = () => {
    if (profile?.profileImage) {
      return profile.profileImage;
    }
    // Generate fallback avatar using user's name or username
    const name = profile?.name || profile?.username || auth?.user?.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`;
  };

  // Get display name
  const getDisplayName = () => {
    return profile?.name || profile?.username || 'User';
  };

  return (
    <header className="bg-navbar-bg backdrop-blur-sm sticky top-0 z-50 border-b border-navbar-border">
      <div className="container mx-auto px-5 sm:px-7 lg:px-10">
        <div className="flex justify-between items-center py-3">
          {/* LOGO + TITLE */}
          <div className="flex items-center space-x-1">
            <img src={Logo} alt="ByteHive Logo" className="w-14 h-14 object-contain" />
            <a href="/" >
              <h1 className="font-fenix text-3xl tracking-wide text-white">
                Bytehive
              </h1>
            </a>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-3 text-xl">
              <a className="flex flex-col items-center text-columbia-blue hover:text-white transition-colors group" href="/events">
                <div className="p-3 rounded-md bg-rich-black-light group-hover:bg-periwinkle-light transition-colors flex items-center justify-center">
                  <span className="material-icons text-4xl">grid_view</span>
                </div>
              </a>
              <a className="flex flex-col items-center text-columbia-blue hover:text-white transition-colors group" href="/communities">
                <div className="p-3 rounded-md bg-rich-black-light group-hover:bg-periwinkle-light transition-colors flex items-center justify-center">
                  <span className="material-icons text-4xl">groups</span>
                </div>
              </a>
              <a className="flex flex-col items-center text-columbia-blue hover:text-white transition-colors group" href="#">
                <div className="p-3 rounded-md bg-rich-black-light group-hover:bg-periwinkle-light transition-colors flex items-center justify-center">
                  <span className="material-icons text-4xl">bookmark</span>
                </div>
              </a>
            </nav>

            {/* Right side (desktop) */}
            <div className="flex items-center space-x-3">
              <a className="flex items-center text-pinkish hover:text-pinkish-dark transition-colors group relative" href="#">
                <div className="p-3 rounded-md bg-rich-black-light group-hover:bg-periwinkle-light transition-colors flex items-center justify-center space-x-1">
                  <span className="material-icons text-4xl" style={{ color: "var(--pinkish)" }}>
                    local_fire_department
                  </span>
                  <span className="text-columbia-blue text-sm font-bold">2</span>
                </div>
              </a>

              <button className="text-columbia-blue hover:text-white p-3 rounded-full hover:bg-periwinkle-light transition-colors relative flex items-center justify-center">
                <span className="material-icons text-3xl">notifications</span>
                <span className="absolute top-1.5 right-1.5 block h-3 w-3 rounded-full bg-medium-slate-blue"></span>
              </button>

              {/* Profile Button with dynamic image from profile context */}
              <button 
                className="flex items-center justify-center group relative"
                title={`${getDisplayName()}'s Profile`}
              >
                {profileLoading ? (
                  // Loading state - show skeleton
                  <div className="w-11 h-11 rounded-full bg-gray-600 animate-pulse border-2 border-transparent"></div>
                ) : (
                  <img
                    alt={`${getDisplayName()}'s profile`}
                    className="w-11 h-11 rounded-full border-2 border-transparent hover:border-periwinkle transition-all object-cover"
                    src={getProfileImage()}
                    onError={(e) => {
                      // Fallback if image fails to load
                      const name = getDisplayName();
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`;
                    }}
                  />
                )}
                
                {/* Remove the hover tooltip - no longer showing user name on hover */}
              </button>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Profile Image */}
            <button className="flex items-center justify-center">
              {profileLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
              ) : (
                <img
                  alt={`${getDisplayName()}'s profile`}
                  className="w-8 h-8 rounded-full border-2 border-transparent hover:border-periwinkle transition-all object-cover"
                  src={getProfileImage()}
                  onError={(e) => {
                    const name = getDisplayName();
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`;
                  }}
                />
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-columbia-blue hover:text-white p-3 rounded-md hover:bg-periwinkle-light transition-colors"
            >
              <span className="material-icons text-4xl">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navbar-bg border-t border-navbar-border px-7 py-5 space-y-5 text-lg">
          {/* Mobile Profile Section */}
          {!profileLoading && (
            <div className="flex items-center space-x-4 pb-3 border-b border-navbar-border">
              <img
                alt={`${getDisplayName()}'s profile`}
                className="w-12 h-12 rounded-full object-cover"
                src={getProfileImage()}
                onError={(e) => {
                  const name = getDisplayName();
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`;
                }}
              />
              <div>
                <div className="text-white font-medium">{getDisplayName()}</div>
                {profile?.bio && (
                  <div className="text-columbia-blue text-sm truncate max-w-48">
                    {profile.bio}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <a href="/communities" className="flex items-center space-x-4 text-columbia-blue hover:text-white transition-colors">
            <span className="material-icons text-2xl">groups</span>
            <span>Communities</span>
          </a>
          <a href="/events" className="flex items-center space-x-4 text-columbia-blue hover:text-white transition-colors">
            <span className="material-icons text-2xl">event</span>
            <span>Events</span>
          </a>
          <a href="#" className="flex items-center space-x-4 text-columbia-blue hover:text-white transition-colors">
            <span className="material-icons text-2xl">bookmark</span>
            <span>Saved</span>
          </a>
          <a href="#" className="flex items-center space-x-4 text-pinkish hover:text-pinkish-dark transition-colors">
            <span className="material-icons text-2xl">local_fire_department</span>
            <span>Streak</span>
          </a>
          <a href="#" className="flex items-center space-x-4 text-columbia-blue hover:text-white transition-colors">
            <span className="material-icons text-2xl">account_circle</span>
            <span>Profile</span>
          </a>
        </div>
      )}
    </header>
  );
}
     