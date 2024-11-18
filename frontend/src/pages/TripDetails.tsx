import React, { useState, useEffect } from 'react';
import { Link, useNavigate,useParams  } from 'react-router-dom';
import './TripDetails.css';
import logo from '../images/logo.png';
import xploraplane from '../images/xplora-plane.png';
import newyork from '../images/new-york.png';
import { calculateTripDays } from '../helper-files/calculateTripDays';

const TripDetails: React.FC = () => {
    const navigate = useNavigate();


    // added buildpath 
    const app_name = 'xplora.fun'; 
    function buildPath(route: string): string {
        if (process.env.NODE_ENV !== 'development') {
            return `https://${app_name}/${route}`;
        } else {
            return `http://localhost:5000/${route}`;
        }
    }

    // the ids for specific user and specific trips
    const { tripId } = useParams<{ tripId: string }>();
    const userId = localStorage.getItem('ID');

    // variables to store the trip detals
    const [tripName, setTripName] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [pictureUrl, setPictureUrl] = useState<string | null>(null);

    const [flightsOpen, setFlightsOpen] = useState(false);
    const [accommodationsOpen, setAccommodationsOpen] = useState(false);
    const [activitiesOpen, setActivitiesOpen] = useState(false);

    const toggleDropdown = (dropdownType: string) => {
        if (dropdownType === 'flights') setFlightsOpen(!flightsOpen);
        if (dropdownType === 'accommodations') setAccommodationsOpen(!accommodationsOpen);
        if (dropdownType === 'activities') setActivitiesOpen(!activitiesOpen);
    };

    const handleAdd = (type: string) => {
        if (type === 'flight') navigate('/add-flight');
        if (type === 'accommodation') navigate('/add-accommodation');
        if (type === 'activity') navigate('/add-activity');
    };

    // more vairables 
    const [daysCount, setDaysCount] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    useEffect(() => {
        // Fetch trip details using the tripId and userId, and calculate days
        const fetchTripDetails = async () => {
            if (!tripId || !userId){
                console.error('Missing tripId or userId');
                return;
            }
            try {
                    const response = await fetch(buildPath(`api/users/${userId}/trips/${tripId}`)); // it wont connect to database, unsure if the api only gets infomartion or also takes info from database
                    console.log('Response:', response);
                    if (response.ok) {
                        const data = await response.json();
                        
                        // Set the fetched data into state
                        setTripName(data.name);
                        console.log('Fetched tripName:', data.name);
                        setCity(data.city);
                        setStartDate(data.start_date);
                        setEndDate(data.end_date);
                        setNotes(data.notes);
                        setPictureUrl(data.picture_url || null);
    
                        // Calculate the number of days using the helper function
                        const days = calculateTripDays(data.start_date, data.end_date);
                        setDaysCount(days);
                    } else {
                        console.error('Failed to fetch trip:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching trip details:', error);
                }
        };
    
        // Call the function to fetch trip details
        fetchTripDetails();
    }, [tripId, userId]);

    return (
        <div className="trip-details-page">
            <header className="tripdetails-header">
                <Link to="/">
                    <img src={logo} alt="Xplora Logo" className="tripdetails-logo" />
                </Link>
                <nav className="tripdetails-nav">
                    <ul>
                        <li><Link to="/dashboard">Home</Link></li>
                    </ul>
                </nav>
            </header>

            <div className="tripdetails-i-container">
                <div className="tripdetails-i-header">{tripName || 'Loading...'}</div>
                <div className="tripdetails-i-content">
                    <div className="trip-card-tripdetails">
                        <div className="deets-and-photo">
                            <div className="td-trip-details">
                                <p className="trip-location">{city || 'Loading city...'}</p>
                                <p className="trip-dates">
                                    {startDate && endDate ? (
                                        <>
                                            {startDate} - {endDate} ({daysCount !== null ? `${daysCount} days` : 'Calculating...'})
                                        </>
                                    ) : (
                                        "Loading dates..."
                                    )}
                                </p>
                            </div>

                            <div className="tripdetails-image-container">
                                <img src={newyork} alt="New York City" className="tripdetails-image" />
                            </div>
                        </div>

                        <div className="note-box">
                            <p>{notes || 'No additional notes'}</p>
                        </div>
                    </div>

                    {/* Dropdown Sections */}
                    <div className="dropdown-all">
                        <div className="dropdown-section">
                            <div className="dropdown-header" onClick={() => toggleDropdown('flights')}>
                                <span className="text">Flights</span>
                                <span className={`arrow ${flightsOpen ? 'open' : ''}`}>▼</span>
                                <div className="tooltip-container">
                                    <button className="add-button" onClick={() => handleAdd('flight')}>+</button>
                                    <span className="tooltip-text">Add new flight</span>
                                </div>
                            </div>
                            {flightsOpen && 
                            <div className='flights-list'>
                                <div className='flight-details'>
                                    <div className='top-info'>
                                        <span id='from-airport'>LHR</span>
                                        <div className="airport-separation-line">
                                            <img src={xploraplane} alt="Airplane Icon" className="airplane-icon" />
                                        </div>                            
                                        <span id='dest-airport'>JFK</span>         
                                    </div>
                                    <div className='bottom-info'>
                                        <div className='from-info'>
                                            <span id='from-city'>London</span>
                                            <span id='from-date'>06/08/2024</span>
                                        </div>
                                        <div className='dest-info'>
                                            <span id='dest-city'>New York</span>
                                            <span id='dest-date'>06/09/2024</span>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            }
                        </div>

                        <div className="dropdown-section">
                            <div className="dropdown-header" onClick={() => toggleDropdown('accommodations')}>
                                <span className="text">Accommodations</span>
                                <span className={`arrow ${accommodationsOpen ? 'open' : ''}`}>▼</span>
                                <div className="tooltip-container">
                                    <button className="add-button" onClick={() => handleAdd('accommodation')}>+</button>
                                    <span className="tooltip-text">Add new accommodation</span>
                                </div>
                            </div>
                            {accommodationsOpen && <div className="dropdown-content">Accommodation details here</div>}
                        </div>

                        <div className="dropdown-section">
                            <div className="dropdown-header" onClick={() => toggleDropdown('activities')}>
                                <span className="text">Activities</span>
                                <span className={`arrow ${activitiesOpen ? 'open' : ''}`}>▼</span>
                                <div className="tooltip-container">
                                    <button className="add-button" onClick={() => handleAdd('activity')}>+</button>
                                    <span className="tooltip-text">Add new activity</span>
                                </div>
                            </div>
                            {activitiesOpen && <div className="dropdown-content">Activity details here</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetails;
