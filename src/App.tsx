import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import ViewItem from './pages/ViewItem';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/add" 
                element={
                  <ProtectedRoute>
                    <AddItem />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/item/:id" 
                element={
                  <ProtectedRoute>
                    <ViewItem />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;