// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogListing from "./pages/BlogListing";
import CreatePost from "./pages/CreatePost";
import EventsListing from "./pages/EventsListing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogListing />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/events" element={<EventsListing />} />
      </Routes>
    </Router>
  );
}

export default App;
