import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorks';
import SignUpPage from './pages/SignUp';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddTrip from './pages/AddTrip'
import EditTrip from './pages/EditTrip';
import TripDetails from './pages/TripDetails';
import ForgotPasswordPage from './pages/ForgotPassword';
import './App.css';

const App: React.FC = () => {
  // children == dashboard, add profile later
  //   const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //     const email = localStorage.getItem('email');

  //     // If there's an email, allow access to the page; otherwise, redirect to login
  //     return email ? <>{children}</> : <Navigate to="/login" />;
  // };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trip-details" element={<TripDetails />} />
        <Route path="/edit-trip" element={<EditTrip />} />
        <Route path="/addtrip" element={<AddTrip />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;