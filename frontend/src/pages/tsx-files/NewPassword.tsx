import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import '../css-files/Login.css';
import '../css-files/NewPassword.css';
import logo from '../../images/logo.png'; // Replace with actual path

interface NewPasswordValues {
    newPassword: string;
    confirmPassword: string;
}

const NewPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required('Required'),
    confirmPassword: Yup.string().required('Required')
});

const app_name = 'xplora.fun'; 

function buildPath(route: string): string {
    if (process.env.NODE_ENV !== 'development') {
        return `https://${app_name}/${route}`;
    } else {
        return `http://localhost:5000/${route}`;
    }
}


const NewPasswordForm: React.FC = () => {

    const navigate = useNavigate();

    return (
        <div className="new-password-page">
            <div className="new-password-main">
                <Link to="/">
                    <img id="new-password-logo" src={logo} />
                </Link>
                <div className="new-password-container">
                    <div className="new-password-form-wrapper">
                        <Formik
                            initialValues={{
                                newPassword: '',
                                confirmPassword: '',
                            }}
                            validationSchema={NewPasswordSchema}
                            onSubmit={async (values: NewPasswordValues, { setSubmitting, setErrors }) => {
                                //debugger
                                console.log("Form submitted");
                                try {
                                    // calls the login api ****must change this
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
                                        localStorage.setItem('email', data.newPassword);

                                        navigate('/dashboard');
                                        // Handle successful login here
                                    } else {
                                        setErrors({ newPassword: data.error });
                                    }
                                } catch (error) {
                                    console.error('Error:', error);
                                    setErrors({ newPassword: 'An error occurred. Please try again.' });
                                } finally {
                                    setSubmitting(false);
                                }
                            }}>
                            {({ isSubmitting }) => (
                                <Form className="new-password-form">
                                    <h2 className='welcome-back'>Create a new password</h2>
                                    <div className="new-password-form-field">
                                        <Field type="newPassword" name="newPassword" placeholder="New password" className="new-password-input-field" />
                                    </div>
                                    <div className="new-password-error-container">
                                        <ErrorMessage name="newPassword" component="div" className="new-password-error-message" />
                                    </div>

                                    <div className="new-password-form-field">
                                        <Field type="password" name="password" placeholder="Confirm password" className="new-password-input-field" />
                                    </div>
                                    <div className="new-password-error-container">
                                        <ErrorMessage name="password" component="div" className="new-password-error-message" />
                                    </div>

                                    <div className="new-password-forgot-password-container">
                                        <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className="new-password-submit-button">
                                        Confirm
                                    </button>
                                </Form>
                            )}
                        </Formik>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPasswordForm;
