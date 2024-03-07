import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CircomEditorPage from "../pages/CircomEditorPage";
import Navbar from "../components/Navbar";

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CircomEditorPage />} />
        <Route path="/editor" element={<CircomEditorPage />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
