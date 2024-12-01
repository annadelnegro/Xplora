import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import * as Yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../css-files/Login.css';
import '../css-files/NewPassword.css';
import logo from '../../images/logo.png'; // Replace with actual path

interface NewPasswordValues {
    newPassword: string;
    confirmPassword: string;
}

const NewPasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[\^$*.[\]{}()?-“!@#%&/,><’:;|_~`]/, 'Password must contain a special character')
        .required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Required')
});

const app_name = 'xplora.fun'; 

function buildPath(route: string): string {
    if (process.env.NODE_ENV !== 'development') {
        return `https://${app_name}/${route}`;
    } else {
        return `http://localhost:5000/${route}`;
    }
}


// function buildPath(route: string): string {
//     if (import.meta.env.MODE === 'development') {
//         console.log("development");
//         return `${import.meta.env.VITE_BASE_URL}/${route}`;
//     } else {
//         console.log("not evelopment");
//         return `${import.meta.env.production.VITE_BASE_URL}/${route}`;
//     }
// }

const NewPasswordForm: React.FC = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();  // this line is used to extract the url parameters

    const token = searchParams.get('token');
    const id = searchParams.get('id');

    console.log('URL Parameters:', window.location.href); // Logs the full URL for debugging

    console.log('token',token);
    console.log('id',id);


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

                                    const payload = {            
                                        token,
                                        id,
                                        newPassword: values.newPassword,
                                    };

                                    console.log('memer');
                                    // calls the reset password api
                                    const response = await fetch(buildPath('api/reset-password'), {
                                        // get information from database
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(payload),

                                    });

                                    const data = await response.json();
                                    

                                    
                                    if (response.ok) {
                                        console.log('Password reset successfully.');
                                        navigate('/login');

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
                                    {/* New password field */}
                                    <div className="new-password-form-field">
                                        <Field type="password" name="newPassword" placeholder="New password" className="new-password-input-field" />
                                    </div>
                                    <div className="new-password-error-container">
                                        <ErrorMessage name="newPassword" component="div" className="new-password-error-message" />
                                    </div>

                                    {/* Confirm password field */}
                                    <div className="new-password-form-field">
                                        <Field type="password" name="confirmPassword" placeholder="Confirm password" className="new-password-input-field" />
                                    </div>
                                    <div className="new-password-error-container">
                                        <ErrorMessage name="confirmPassword" component="div" className="new-password-error-message" />
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
