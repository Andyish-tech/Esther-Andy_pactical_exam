import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Navigation from "./components/Navigation";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

// Protection wrapper component for private dashboard pages
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

// Redirect wrapper to prevent authenticated users from visiting login/register
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  return !token ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <div className="App min-h-screen bg-[#090d16] text-[#f1f5f9] flex flex-col">
      <Navigation />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Catch-all redirect to welcome landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;