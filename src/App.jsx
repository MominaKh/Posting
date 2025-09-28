// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import BlogListing from "./pages/BlogListing";
import CreatePost from "./pages/CreatePost";
import EventsListing from "./pages/EventsListing";
import CreateEvent from "./pages/CreateEvent";
import BlogDetailPage from "./pages/BlogDetailPage";
import Register from "./pages/Auth/Register/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import GoogleAuth from "./pages/Auth/GoogleAuth";
import { Toaster } from "react-hot-toast";
import ProfilePage from "./pages/ProfilePage";
import ProfileSetupPage from "./pages/Auth/Register/ProfileSetupPage";
import TagSelectionPage from "./pages/Auth/Register/TagSelectionPage";
import { useAuth } from "./context/auth";
import { NotificationProvider } from "./context/NotificationContext";
import { ProfileProvider } from "./context/profileContext";
import CreateCommunity from "./pages/CreateCommunity";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import SavedItems from "./pages/SavedItems";
import History from "./pages/History";

function App() {
  return (
    <Router>
      <ProfileProvider>
        <NotificationProvider>
          <Toaster />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/setup-profile" element={<RequireStep minStep={2}><ProfileSetupPage /></RequireStep>} />
            <Route path="/select-tags" element={<RequireStep minStep={3}><TagSelectionPage /></RequireStep>} />
            <Route path="/login" element={<Login />} />
            <Route path="/google-auth" element={<GoogleAuth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<RequireStep minStep={4}><ProfilePage /></RequireStep>} />
            <Route path="/" element={<BlogListing />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/events" element={<EventsListing />} />
            <Route path="/create-event" element={<CreateEvent />} />
            {/* Blog detail page - accepts postId */}
            <Route path="/post/:postId" element={<BlogDetailPage />} />

            {/* Default for now (example postId = 1) */}
            <Route path="/post" element={<BlogDetailPage postId="1" />} />

            <Route path="/create-community" element={<CreateCommunity />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/community/:id" element={<CommunityDetail />} />
            <Route path="/saved" element={<SavedItems />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </NotificationProvider>
      </ProfileProvider>
    </Router>
  );
}
function getRedirectPath(step) {
  if (!step) return "/login";
  if (step === 1) return "/register";
  if (step === 2) return "/setup-profile";
  if (step === 3) return "/select-tags";
  return "/";
}

function RequireStep({ minStep, children }) {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // show spinner/loader until auth is ready
  }

  const userStep = auth?.token ? auth?.user?.onboardingStep : 1;
  if (userStep < minStep) {
    return <Navigate to={getRedirectPath(userStep)} />;
  }
  return children;
}
export default App;
