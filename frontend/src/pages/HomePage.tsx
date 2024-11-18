import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';
import logo from '../images/logo.png';
import mapimg from '../images/map.png'
import purplepin from '../images/purplepin.png'
import bluepin from '../images/bluepin.png'
import yellowpin from '../images/yellowpin.png'

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/sign-up');
  };

  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="homepage-header">
        <div className="logo-section">
          <Link to="/">
            <img src={logo} alt="Xplora Logo" id="homepage-logo" />
          </Link>
        </div>
        <div className="links-section">
          <div><Link to="/how-it-works">How it works</Link></div>
        </div>
        <div className="user-section">
          <button id="login-btn"><Link to="/login">Sign In</Link></button>
          <button id="register-btn"><Link to="/sign-up">Sign Up</Link></button>
        </div>
      </header>

      <main className="homepage-main">
        <div className="homepage-intro">
          <h1>Let's <span>XPLORA</span> Place Together!</h1>
          <button className="get-started-button" onClick={handleGetStartedClick}>
            Xplore NOW!
          </button>
        </div>
        <div className='map-section'>
          <img id="map" src={mapimg} />
          <img className="map-pins" id="purple-pin" src={purplepin} />
          <img className="map-pins" id="blue-pin" src={bluepin} />
          <img className="map-pins" id="yellow-pin" src={yellowpin} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;