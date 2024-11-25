import React from 'react';
import '../css-files/HowItWorks.css';
import '../css-files/ForgotPassword.css';
import logo from '../../images/logo.png';

import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';


interface ForgotPasswordFormValues {
    email: string;
    // password: string;
}

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required')
});

const app_name = 'xplora.fun'; // Replace with your actual production server domain, e.g., 'example.com'

function buildPath(route: string): string {
    if (process.env.NODE_ENV !== 'development') {
        return `https://${app_name}/${route}`;
    } else {
        return `http://localhost:5000/${route}`;
    }
}

const ForgotPasswordPage: React.FC = () => {
    
    const navigate = useNavigate();

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-main">
                <Link to="/">
                    <img id="forgot-password-logo" src={logo} />
                </Link>
                <div className="forgot-password-container">
                    <div className="forgot-password-form-wrapper">
                        <Formik
                            initialValues={{
                                email: '',
                                // password: '',
                            }}
                            validationSchema={ForgotPasswordSchema}
                            onSubmit={async (values: ForgotPasswordFormValues, { setSubmitting, setErrors }) => {
                                //debugger
                                console.log("Form submitted");
                                try {
                                    // calls the login api 
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
                                        localStorage.setItem('ID', data.id);
                                        console.log(data.id);
                                        localStorage.setItem('firstName', data.firstName);
                                        localStorage.setItem('lastName', data.lastName);
                                        localStorage.setItem('email', data.email);

                                        navigate('/dashboard');
                                        // Handle successful login here
                                    } else {
                                        setErrors({ email: data.error });
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                    setErrors({ email: 'An error occurred. Please try again.' });
                                } finally {
                                    setSubmitting(false);
                                }
                            }}>
                            {({ isSubmitting }) => (
                                <Form className="forgot-password-form">
                                    <h2 id="forgot-h2">Forgot Your Password?</h2>
                                    <p>Please enter your account's email below. You will receive an email containing a link to reset your password.</p>
                                    <div className="forgot-password-form-field">
                                        <Field type="email" name="email" placeholder="Email" className="forgot-password-input-field" />
                                    </div>
                                    <div className="forgot-password-error-container">
                                        <ErrorMessage name="email" component="div" className="forgot-password-error-message" />
                                    </div>

                                    {/* <div className="forgot-password-form-field">
                                        <Field type="password" name="password" placeholder="Password" className="forgot-password-input-field" />
                                    </div>
                                    <div className="forgot-password-error-container">
                                        <ErrorMessage name="password" component="div" className="forgot-password-error-message" />
                                    </div> */}

                                    <div className="return-login-forgot-password-container">
                                        <Link to="/login" className="return-login-link">Return to Login Page</Link>
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className="forgot-password-submit-button">
                                        Reset My Password
                                    </button>
                                </Form>
                            )}
                        </Formik>
                        <p className="signup-link">Don't have an account? <Link to="/sign-up">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;