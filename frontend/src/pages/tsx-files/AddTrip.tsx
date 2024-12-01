import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css-files/AddTrip.css';
import logo from '../../images/logo.png';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LocationSearch from '../helper-files/LocationSearch';


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

const app_name = 'xplora.fun'; 
function buildPath(route: string): string {
    if (process.env.NODE_ENV !== 'development') {
        return `https://${app_name}/${route}`;
    } else {
        return `http://localhost:5000/${route}`;
    }
}



const AddTrip: React.FC = () => {
    const navigate = useNavigate();
    const [photo, setPhoto] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]){
            const selectedFile = event.target.files[0];

            const maxSize = 5 * 1024 * 1024;
            if(selectedFile.size > maxSize){
                setImageError("File size must be no larger than 5MB.");
                setPhoto(null);
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if(!allowedTypes.includes(selectedFile.type)) {
                setImageError("Invalid file type. Please upload JPEG, JPG or PNG only.");
                setPhoto(null);
                return;
            }
            setImageError(null);
            setPhoto(selectedFile);
        }
    }

    // async await to wait for asynchronous operations, like fetching data from server
    // setSubmitting and setErrors are formik helpers
    const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formData = new FormData;
        formData.append('name', values.tripName);
        formData.append('city', values.location);
        formData.append('start_date', formatDate(values.startDate));
        formData.append('end_date', formatDate(values.endDate));
        formData.append('notes', values.notes || '');
        if (photo) {
            formData.append('photo', photo);
        }

        const userId = localStorage.getItem('ID'); // Get user ID from localStorage
    
        // go back to log in if no id found
        if (!userId) {
            alert('User ID not found. Please log in again.');
            navigate('/login');
            return;
        }
    
        // SENDING POST REQUEST FROM THE BACKEND
        try {
            // Construct the API endpoint URL
            const response = await fetch(buildPath(`api/users/${userId}/trips`), {
                method: 'POST',
                body: formData,
            });
    
            // after the server processes the request, it sends back a response.
            const data = await response.json();
    
            if (response.ok) {
                console.log('Trip added successfully:', data);
    
                // Navigate to the dashboard after successful submission
                alert('Trip added successfully!');
                navigate('/dashboard');
            } else {
                console.error('Error adding trip:', data);
                setErrors({ tripName: data.error || 'Failed to add the trip' });
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors({ tripName: 'An error occurred. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="addtrip-page">
            <header className="homepage-header">
                <div className="logo-section">
                    <Link to="">
                        <img src={logo} alt="Xplora Logo" id="homepage-logo" />
                    </Link>
                </div>
                <div className='actions-section'>
                    <button id="profile-btn"><Link to="/dashboard">Home</Link></button>
                </div>
            </header>

            <main className="addtrip-main">
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
                            {({ setFieldValue, setFieldTouched, values, errors, touched, isSubmitting }) => (
                                <Form className="trip-form">
                                    <div className="form-group">
                                        <label htmlFor="tripName">Trip Name</label>
                                        <Field type="text" id="tripName" name="tripName" className="input-field" />
                                        <ErrorMessage name="tripName" component="div" className="error" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="location">Location <span className='location-format'>City, State, Country</span></label>
                                        <Field
                                            name='location'
                                            component={LocationSearch}
                                        />
                                        <ErrorMessage name="location" component="div" className="error" />
                                    </div>

                                    <div className="form-group date-picker">
                                        <label htmlFor="startDate">Start Date</label>
                                        <DatePicker
                                            id="startDate"
                                            selected={values.startDate}
                                            onChange={(date) => setFieldValue('startDate', date)}
                                            onBlur={() => setFieldTouched('startDate', true)}
                                            dateFormat="yyyy-MM-dd"
                                            className={`input-field ${errors.startDate && touched.startDate ? 'invalid' : ''}`}
                                            placeholderText="Select start date"
                                        />
                                        <ErrorMessage name="startDate" component="div" className="error" />
                                    </div>

                                    <div className="form-group date-picker">
                                        <label htmlFor="endDate">End Date</label>
                                        <DatePicker
                                            id="endDate"
                                            selected={values.endDate}
                                            onChange={(date) => setFieldValue('endDate', date)}
                                            onBlur={() => setFieldTouched('endDate', true)}
                                            dateFormat="yyyy-MM-dd"
                                            className={`input-field ${errors.endDate && touched.endDate ? 'invalid' : ''}`}
                                            placeholderText="Select end date"
                                        />
                                        <ErrorMessage name="endDate" component="div" className="error" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="notes">Notes</label>
                                        <Field as="textarea" id="notes" name="notes" className="input-field" />
                                        <ErrorMessage name="notes" component="div" className="error" />
                                    </div>

                                    <div className="photo-upload-container">
                                        <h2 className='upload-photo-text'>Upload Photo</h2>
                                        <label htmlFor='photo-upload' className='custom-upload-button'>
                                            Choose File
                                        </label>
                                        <input 
                                            id='photo-upload'
                                            type="file" 
                                            name="photo" 
                                            onChange={handlePhotoChange}
                                            style={{ display: 'none' }}
                                        />
                                        {photo && <p className='file-name'>{photo.name}</p>}
                                        {imageError && <div className='error'>{imageError}</div>}
                                    </div>

                                    <div className='save-and-cancel-buttons'>
                                        <button type="submit" className="save-btn" disabled={isSubmitting}>
                                            {isSubmitting ? 'Saving...' : 'Save'}
                                        </button>

                                        <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>
                                            Cancel
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddTrip;