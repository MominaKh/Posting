// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogListing from "./pages/BlogListing";
import CreatePost from "./pages/CreatePost";
import EventsListing from "./pages/EventsListing";
import CreateEvent from "./pages/CreateEvent";
import BlogDetailPage from "./pages/BlogDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogListing />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/events" element={<EventsListing />} />
        <Route path="/create-event" element={<CreateEvent />} />
        {/* Blog detail page - accepts postId */}
        <Route path="/post/:postId" element={<BlogDetailPage />} />

        {/* Default for now (example postId = 1) */}
        <Route path="/post" element={<BlogDetailPage postId="1" />} />
      </Routes>
    </Router>
  );
}

export default App;
