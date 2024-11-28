import React from 'react';
import '../css-files/HowItWorks.css';
import '../css-files/ProfileSecurity.css';
import logo from '../../images/logo.png';

import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import { handleLogout } from './Dashboard'; 


interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().email('Invalid password').required('Required'),
    newPassword: Yup.string().required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Required')
});

// const app_name = 'xplora.fun'; 

// function buildPath(route: string): string {
//     if (process.env.NODE_ENV !== 'development') {
//         return `http://${app_name}:5000/${route}`;
//     } else {
//         return `http://localhost:5000/${route}`;
//     }
// }

const ProfileSecurityPage: React.FC = () => {
    return (
        <div className="profile-security-page">
        {/* Header Section */}
        <header className="homepage-header">
            
            <img src={logo} alt="Xplora Logo" className="homepage-logo" />
       
            <nav className="homepage-nav">
                <ul>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                </ul>
            </nav>
        </header>
            
            <div id="profile-sidebar" className="profile-sidebar">
                <a href="/profile">Home</a>
                <a href="/security">Security</a>                
            </div>
            
            <div className="profile-main">
                <div className="outer-container">
                    <div id="security" className="main-container">
                        <div className="change-password-container">
                            <Formik
                                initialValues={{
                                    currentPassword: '',
                                    newPassword: '',
                                    confirmPassword: ''
                                }}

                                validationSchema={PasswordSchema}

                                onSubmit={(values: ChangePasswordFormValues) => {
                                    console.log(values);
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="change-password-form">
                                        {/* current password field */}
                                        <div className="change-password-form-field">
                                            <Field type="password" 
                                            name="currentPassword" 
                                            placeholder="Enter Current Password" 
                                            className="change-password-input-field" />
                                        </div>
                                        <div className="change-password-error">
                                            <ErrorMessage name="currentPassword" 
                                            component="div" 
                                            className="error-message" />
                                        </div>

                                        {/* new password field */}
                                        <div className="change-password-form-field">
                                            <Field type="password" name="newPassword" placeholder="Enter New Password" className="change-password-input-field" />
                                        </div>
                                        <div className="new-password-error">
                                            <ErrorMessage name="newPassword" component="div" className="error-message" />
                                        </div>

                                        {/* confirm password field */}
                                        <div className="change-password-form-field">
                                            <Field type="password" 
                                            name="confirmPassword" 
                                            placeholder="Confirm New Password" 
                                            className="change-password-input-field" />
                                        </div>
                                        <div className="change-password-error">
                                            <ErrorMessage name="confirmPassword" 
                                            component="div" 
                                            className="error-message" />
                                        </div>

                                        <button type="submit" disabled={isSubmitting} className="signup-submit-button">
                                            Change Password
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                            {/* <h1>Change Password</h1>
                                <div id="Current Password">Current Password</div>
                                <div id="New Password">New Password</div>
                                <div id="Confirm Password">Confirm New Password</div>
                                <button className="change-password">Change Password</button> */}
                        </div>
                        <div className="delete-account-account">
                            <h1>Delete Account</h1>
                            <p>By clicking Confirm, you confirm that you would like to 
                                start the process of email verification to delete your account. You can exit the process at any time.</p>
                            <button className="delete-account">Delete Account</button>
                        </div>
                    </div>
                </div>
                
                

            </div>

        </div>

        
    );
};

export default ProfileSecurityPage;