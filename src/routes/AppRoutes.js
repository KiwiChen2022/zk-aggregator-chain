import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "../pages/HomePage";
import CircomEditorPage from "../pages/CircomEditorPage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CircomEditorPage />} />
        <Route path="/editor" element={<CircomEditorPage />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
