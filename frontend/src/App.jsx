// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { ArticlePage } from "./pages/ArticlePage"; // <-- Make sure this is imported

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* This route handles the dynamic ID */}
          <Route path="article/:id" element={<ArticlePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
