import React, { useState } from "react";
import "./assets/css/index.css";
import Experience from "./pages/Experience/Experience";
import Contact from "./pages/Contact/Contact";
import Projects from "./pages/Projects/Projects";
import Header from "./pages/Header/Header";
import Hero from "./pages/Hero/Hero";
import Skills from "./pages/Skills/Skills";
import Education from "./pages/Education/Education";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Admin imports
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProjectsManager from "./pages/admin/ProjectsManager";
import HeroEditor from "./pages/admin/HeroEditor";
import SkillsEditor from "./pages/admin/SkillsEditor";
import ExperienceEditor from "./pages/admin/ExperienceEditor";

import EducationEditor from "./pages/admin/EducationEditor";
import Settings from "./pages/admin/Settings";
import Overview from "./pages/admin/Overview";

import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

export default function App() {
  const [isOnePage, setIsOnePage] = useState(false); // Toggle state
  const location = useLocation();
  
  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  return (
    <>
      <ScrollToTop />
      {/* Hide Header on admin pages */}
      {!isAdminPage && <Header />}
      {/* Conditional Rendering */}
      {isOnePage ? (
        // One-Page Mode: Render all components together
        <>
          <Hero />
          <Skills />
          <Experience />
          <Education />
          <Contact />
          <Analytics />
        </>
      ) : (
        // Router Mode: Use routes for navigation
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard/projects" replace />} />
            <Route path="projects" element={
              <ProtectedRoute>
                <ProjectsManager />
              </ProtectedRoute>
            } />
            <Route path="hero" element={
              <ProtectedRoute>
                <HeroEditor />
              </ProtectedRoute>
            } />
            <Route path="skills" element={
              <ProtectedRoute>
                <SkillsEditor />
              </ProtectedRoute>
            } />
            <Route path="experience" element={
              <ProtectedRoute>
                <ExperienceEditor />
              </ProtectedRoute>
            } />
            <Route path="education" element={
              <ProtectedRoute>
                <EducationEditor />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      )}
      {/* Hide Footer on admin pages */}
      {!isAdminPage && <Footer />}
    </>
  );
}

