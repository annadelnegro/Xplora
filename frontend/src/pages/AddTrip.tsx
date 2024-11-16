import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AddTrip.css';
import logo from '../images/logo.png';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const validationSchema = Yup.object({
    tripName: Yup.string().required('Trip Name is required'),
    location: Yup.string().required('Location is required'),
    startDate: Yup.date().nullable().required('Start Date is required'),
    endDate: Yup.date()
        .nullable()
        .required('End Date is required')
        .min(Yup.ref('startDate'), 'End date can’t be before start date'),
    notes: Yup.string(),
});

const AddTrip: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (values: any) => {
        console.log('Form data:', values);
        alert('Form submitted successfully!');
        navigate('/dashboard');
    };

    const handlePhotoSubmit = (values: any) => {
        console.log('Photo data:', values.photo);
        alert('Photo uploaded successfully!');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="addtrip-page">
            <header className="homepage-header">
                <div className="logo-section">
                    <Link to="/">
                        <img src={logo} alt="Xplora Logo" id="homepage-logo" />
                    </Link>
                </div>
                <div className='actions-section'>
                    <button id="profile-btn"><Link to="/dashboard">Home</Link></button>
                </div>
            </header>

            <main className="addtrip-main">
                <div className="back-arrow-container">
                    <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" onClick={handleBack} />
                </div>
                <h1 className="add-trip-header">Add a Trip</h1>
                <p className="p1">Let's make the best out of your trip together!</p>

                <div className="addtrip-dashboard-i-container">
                    <div className="trip-form-container">
                        <Formik
                            initialValues={{
                                tripName: '',
                                location: '',
                                startDate: null,
                                endDate: null,
                                notes: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
                                <Form className="trip-form">
                                    <div className="form-group">
                                        <label htmlFor="tripName">Trip Name</label>
                                        <Field
                                            type="text"
                                            id="tripName"
                                            name="tripName"
                                            className="input-field"
                                        />
                                        <ErrorMessage name="tripName" component="div" className="error" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="location">Location</label>
                                        <Field
                                            type="text"
                                            id="location"
                                            name="location"
                                            className="input-field"
                                        />
                                        <ErrorMessage name="location" component="div" className="error" />
                                    </div>

                                    {/* Start Date Field with Icon */}
                                    <div className="form-group date-picker">
                                        <label htmlFor="startDate">Start Date</label>
                                        <div className="date-picker-container">
                                            <DatePicker
                                                id="startDate"
                                                selected={values.startDate}
                                                onChange={(date) => setFieldValue('startDate', date)}
                                                onBlur={() => setFieldTouched('startDate', true)}
                                                dateFormat="yyyy-MM-dd"
                                                className={`input-field ${errors.startDate && touched.startDate ? 'invalid' : ''}`}
                                                placeholderText="Select start date"
                                            />
                                            <FontAwesomeIcon
                                                icon={faCalendarAlt}
                                                className="calendar-icon"
                                                onClick={() => document.getElementById('startDate')?.focus()}
                                            />
                                        </div>
                                        <ErrorMessage name="startDate" component="div" className="error" />
                                    </div>

                                    {/* End Date Field with Icon */}
                                    <div className="form-group date-picker">
                                        <label htmlFor="endDate">End Date</label>
                                        <div className="date-picker-container">
                                            <DatePicker
                                                id="endDate"
                                                selected={values.endDate}
                                                onChange={(date) => setFieldValue('endDate', date)}
                                                onBlur={() => setFieldTouched('endDate', true)}
                                                dateFormat="yyyy-MM-dd"
                                                className={`input-field ${errors.endDate && touched.endDate ? 'invalid' : ''}`}
                                                placeholderText="Select end date"
                                            />
                                            <FontAwesomeIcon
                                                icon={faCalendarAlt}
                                                className="calendar-icon"
                                                onClick={() => document.getElementById('endDate')?.focus()}
                                            />
                                        </div>
                                        <ErrorMessage name="endDate" component="div" className="error" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="notes">Notes</label>
                                        <Field
                                            as="textarea"
                                            id="notes"
                                            name="notes"
                                            className="input-field"
                                        />
                                        <ErrorMessage name="notes" component="div" className="error" />
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Separate form for photo upload */}
                    <div className="photo-upload-container">
                        <h2>Upload Photo</h2>
                        <Formik
                            initialValues={{ photo: null }}
                            onSubmit={handlePhotoSubmit}
                        >
                            {({ setFieldValue }) => (
                                <Form className="photo-upload-form">
                                    <div className="form-group">
                                        <label htmlFor="photo">Change Photo</label>
                                        <input
                                            type="file"
                                            id="photo"
                                            name="photo"
                                            accept="image/*"
                                            onChange={(event) =>
                                                setFieldValue('photo', event.currentTarget.files?.[0])
                                            }
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="button-group">
                                        <button type="submit" className="upload-btn">Upload Photo</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="button-group">
                            <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
                                Cancel
                            </button>
                            <button type="submit" className="save-btn">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddTrip;