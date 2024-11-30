import React from 'react';
import '../css-files/HowItWorks.css'; // Create this CSS file for styling
import logo from '../../images/logo.png';
import { Link } from 'react-router-dom';

import signup from '../../images/signup.png';
import customize from '../../images/customize.png';
import plane from '../../images/xplora-plane.png';
import ready from '../../images/ready.png';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="how-it-works-page">
      <header className="homepage-header">
        <div className="logo-section">
          <Link to="/">
            <img src={logo} alt="Xplora Logo" id="homepage-logo" />
          </Link>


        <div className="r-buttons">
          <button id="r-login-btn"><Link to="/login">Sign In</Link></button>
          <button id="r-register-btn"><Link to="/sign-up">Sign Up</Link></button>
        </div>
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
            <p>Get started with XPLORA and take the stress out of travel—sign up now to effortlessly organize your trips.</p>
          </div>

          <div className="step">
            <h2 style={{ color: '#6666FF' }}>Step 2: Add Trips</h2>
            <img src={plane} alt="Explore Logo" id="explore-logo-howitworks" />
            <p>Add your upcoming flights, stays, and activities to your profile and save time for what truly matters—enjoying the journey.</p>
          </div>

          <div className="step">
            <h2 style={{ color: '#FF9933' }}>Step 3: Customize</h2>
            <img src={customize} alt="Customize Logo" id="customize-logo-howitworks" />
            <p>Tailor your trips your way—add photos, notes, and all the details that matter most.</p>
          </div>

          <div className="step">
            <h2 style={{ color: '#009999' }}>Step 4: Travel Away!</h2>
            <img src={ready} alt="Connect Logo" id="connect-logo-howitworks" />
            <p>We are now ready to XPLORA place together!</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorksPage;