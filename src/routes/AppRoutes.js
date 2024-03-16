import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CircomEditorPage from "../pages/CircomEditorPage";
import Navbar from "../components/Navbar";
import MerkleProofPage from "../pages/MerkleProofPage";
import { Flex } from "@chakra-ui/react";

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<CircomEditorPage />} />
        <Route path="/merkle-proof" element={<MerkleProofPage />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
