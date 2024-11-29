import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/tsx-files/HomePage';
import HowItWorksPage from './pages/tsx-files/HowItWorks';
import SignUpPage from './pages/tsx-files/SignUp';
import LoginPage from './pages/tsx-files/Login';
import Dashboard from './pages/tsx-files/Dashboard';
import AddTrip from './pages/tsx-files/AddTrip'
//import EditTrip from './pages/EditTrip';
import TripDetails from './pages/tsx-files/TripDetails';
import ForgotPasswordPage from './pages/tsx-files/ForgotPassword';
import NewPassword from './pages/tsx-files/NewPassword';
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
        <Route path="/trip-details/:tripId" element={<TripDetails />} />

        {/*        <Route path="/edit-trip" element={<EditTrip />} /> */}

        <Route path="/addtrip" element={<AddTrip />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/newpassword" element={<NewPassword />} />
      </Routes>
    </Router>
  );
};

export default App;