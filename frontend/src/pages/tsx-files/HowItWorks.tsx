import React from 'react';
import '../css-files/HowItWorks.css'; // Create this CSS file for styling
import logo from '../../images/logo.png';
import { Link } from 'react-router-dom';

import signup from '../../images/signup.png';
import explore from '../../images/explore.png';
import customize from '../../images/customize.png';
import connect from '../../images/connect.png';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="how-it-works-page">
      <header className="homepage-header">
        <div className="logo-section">
          <Link to="/">
            <img src={logo} alt="Xplora Logo" id="homepage-logo" />
          </Link>
        </div>
        <div className="user-section">
          <button id="login-btn"><Link to="/login">Sign In</Link></button>
          <button id="register-btn"><Link to="/sign-up">Sign Up</Link></button>
        </div>
      </header>

      <main className='how-it-works-main'>
        <header className="how-it-works-header">
          <h1>How It Works</h1>
          <p>Learn how to get started with Xplora in a few simple steps!</p>
        </header>

        <section className="how-it-works-steps">
          <div className="step">
            <h2 style={{ color: '#2E8B57' }}>Step 1: Sign Up</h2>
            <img src={signup} alt="Signup Logo" id="signup-logo-howitworks" />
            <p>Register an account with Xplora to access personalized features.</p>
          </div>

          <div className="step">
            <h2 style={{ color: '#6666FF' }}>Step 2: Explore</h2>
            <img src={explore} alt="Explore Logo" id="explore-logo-howitworks" />
            <p>Browse and explore the features available to you on the platform.</p>
          </div>

          <div className="step">
            <h2 style={{ color: '#FF9933' }}>Step 3: Customize</h2>
            <img src={customize} alt="Customize Logo" id="customize-logo-howitworks" />
            <p>Personalize your experience by updating your settings and preferences.</p>
          </div>

          <div className="step">
            <h2 style={{ color: '#009999' }}>Step 4: Connect</h2>
            <img src={connect} alt="Connect Logo" id="connect-logo-howitworks" />
            <p>Engage with the community and travel away.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorksPage;