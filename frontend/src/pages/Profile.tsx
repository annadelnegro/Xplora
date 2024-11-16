import React, { useEffect, useState } from 'react';
import { handleLogout } from './Dashboard'; 
import { useNavigate, Link } from 'react-router-dom';
// import { db } from 

import './HowItWorks.css'; // Create this CSS file for styling
import './Profile.css';

import logo from '../images/logo.png';
import image1 from '../images/image1.png';

const ProfilePage: React.FC = () => { 
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<String>('');

    useEffect(() => {
        // Retrieve first and last names from localStorage
        const storedFirstName = localStorage.getItem('firstName');
        const storedLastName = localStorage.getItem('lastName');
        const storedEmail = localStorage.getItem('email');

        if (storedFirstName && storedLastName && storedEmail) {
            setFirstName(storedFirstName);
            setLastName(storedLastName);
            setEmail(storedEmail);
        } else {
            // Redirect to login if data is missing
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="profile-page">
        {/* Header Section */}
        <header className="profile-header">
            <Link to="/">
            <img src={logo} alt="Xplora Logo" className="homepage-logo" />
            </Link>
        <nav className="profile-nav">
            <ul>
                <li><Link to="/profile">Profile</Link></li>
                <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            </ul>
        </nav>
        </header>
        
        <div className="profile-body">
            <div id="profile-sidebar" className="profile-sidebar">
                <a href="/profile">Home</a>
                <a href="/profile-security">Security</a>                
            </div>
            
            <div className="profile-main">
                <div className="profile-outer-container">
                    <div id="home" className="profile-main-container">
                        <img src={image1} alt="Profile Picture" className="profile-picture" />
                        
                        <div className="profile-main-column">
                            <div>
                                Name:
                                <div id="name">{firstName} {lastName}</div>
                            </div>
                            <div>
                                Email:
                                <div id="email">{email}</div>
                            </div>
                            {/* <div>
                                Age:
                                <div id="age">Filler</div>
                            </div> */}
                        </div>

                        <div className="profile-main-column">
                            <div>
                                Places {firstName} {lastName} has XPLORED:
                            <div id="blue-box">.</div>
                            <div id="place">Filler</div>
                            <div id="place">Filler</div>
                            <div id="place">Filler</div>
                            <div id="place">Filler</div>
                            <div id="place">Filler</div>
                            {/* try 
                            {
                                // calls the Trips API to 
                                const response = await fetch(buildPath('api/login'), {
                                    // get information from database
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(values),
                                });
                        
                                const data = await response.json();
                        
                                if (response.ok) {
                                    console.log('Login successful:', data);

                                    // Store user data in localStorage
                                    localStorage.setItem('userId', data.id);
                                    localStorage.setItem('firstName', data.firstName);
                                    localStorage.setItem('lastName', data.lastName);
                                    localStorage.setItem('email', data.email);

                                    navigate('/dashboard'); 
                                    // Handle successful login here
                                } else {
                                    setErrors({ email: data.error });
                                }
                            } 
                            catch (error) 
                            {
                              console.error('Error:', error);
                              setErrors({ email: 'An error occurred. Please try again.' });
                            } 
                            finally 
                            {
                                setSubmitting(false);
                            } */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default ProfilePage;