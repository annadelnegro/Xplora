import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import '../css-files/SignUp.css';
import logo from '../../images/logo.png'; // Adjust path if needed

interface SignupFormValues {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
}

const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[\^$*.[\]{}()?-“!@#%&/,><’:;|_~`]/, 'Password must contain a special character')
        .required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required')
});


const app_name = 'xplora.fun'; // Replace with your actual production server domain, e.g., 'example.com'

function buildPath(route: string): string {
    if (process.env.NODE_ENV !== 'development') {
        return `https://${app_name}/${route}`;
    } else {
        return `http://localhost:5000/${route}`;
    }
}


const SignupForm: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="signup-page">
            <div className="sign-up-main">
                <Link to="/">
                    <img id="sign-up-logo" src={logo} />
                </Link>
                <div className="signup-container">
                    <div className='sign-up-form-wrapper'>
                        <Formik
                            initialValues={{
                                email: '',
                                firstName: '',
                                lastName: '',
                                password: '',
                                confirmPassword: '',
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={async (values: SignupFormValues, { setSubmitting, setErrors }) => {
                                const payload = {
                                    first_name: values.firstName,
                                    last_name: values.lastName,
                                    email: values.email,
                                    password: values.password,
                                };
                                try {
                                    const response = await fetch(buildPath('api/register'), {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(payload),
                                    });
                            
                                    const data = await response.json();
                            
                                    if (response.ok) {
                                        console.log('User registered successfully:', data.message);

                                        console.log('User registered successfully:', data.first_name);
                                        localStorage.setItem('firstName', data.first_name);
                                        localStorage.setItem('lastName', data.last_name);
                                       // localStorage.setItem('email', data.email);
                                        
                                        
                                        navigate('/Dashboard'); // Redirect to login page on success

                                    } else {
                                        setErrors({ email: data.error });
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                    setErrors({ email: 'An error occurred. Please try again.' });
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form className="signup-form">

                                    {/* Email field */}
                                    <div className="signup-form-field">
                                        <Field type="email" name="email" placeholder="Email" className="signup-input-field" />
                                    </div>
                                    <div className="signup-error">
                                        <ErrorMessage name="email" component="div" className="signup-error-message" />
                                    </div>

                                    {/* First name field */}
                                    <div className="signup-form-field">
                                        <Field type="text" name="firstName" placeholder="First Name" className="signup-input-field" />
                                    </div>
                                    <div className="signup-error">
                                        <ErrorMessage name="firstName" component="div" className="signup-error-message" />
                                    </div>

                                    {/* Last name field */}
                                    <div className="signup-form-field">
                                        <Field type="text" name="lastName" placeholder="Last Name" className="signup-input-field" />
                                    </div>
                                    <div className="signup-error">
                                        <ErrorMessage name="lastName" component="div" className="signup-error-message" />
                                    </div>

                                    {/* Password field */}
                                    <div className="signup-form-field">
                                        <Field type="password" name="password" placeholder="Password" className="signup-input-field" />
                                    </div>
                                    <div className="signup-error">
                                        <ErrorMessage name="password" component="div" className="signup-error-message" />
                                    </div>

                                    {/* Confirm password field */}
                                    <div className="signup-form-field">
                                        <Field type="password" name="confirmPassword" placeholder="Verify Password" className="signup-input-field" />
                                    </div>
                                    <div className="signup-error">
                                        <ErrorMessage name="confirmPassword" component="div" className="signup-error-message" />
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className="signup-submit-button">
                                        Get Exploring!
                                    </button>
                                </Form>
                            )}
                        </Formik>
                        <p className="login-link">Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;