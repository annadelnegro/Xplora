import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import TripListItem from '../components/TripListItem';
import iconlogo from '../images/xplora-icon.png';
import profileicon from '../images/profile-icon.png';
import editicon from '../images/edit-icon.png';
import cancelicon from '../images/cancel-icon.png';
import saveicon from '../images/save-icon.png'


export const handleLogout = () => {
    const navigate = useNavigate();
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('ID');
    localStorage.removeItem('email');
    navigate('/login');
};

const app_name = 'xplora.fun'; 
function buildPath(route: string): string {
    if (process.env.NODE_ENV !== 'development') {
        return `https://${app_name}/${route}`;
    } else {
        return `http://localhost:5000/${route}`;
    }
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [trips, setTrips] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editFirstName, setEditFirstName] = useState<string>('');
    const [editLastName, setEditLastName] = useState<string>('');
    const [editEmail, setEditEmail] = useState<string>('');


    
    
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleEditProfile = () => {
        setIsEditing(true);
        setEditFirstName(firstName);
        setEditLastName(lastName);
        setEditEmail(email);
    }

    const handleCancelProfile = () => setIsEditing(false);

    const handleSaveProfile = () => {
        setEditFirstName(editFirstName);
        setEditLastName(editLastName);
        setEditEmail(editEmail);

        localStorage.setItem('firstName', editFirstName);
        localStorage.setItem('lastName', editLastName);
        localStorage.setItem('email', editEmail);
        setIsEditing(false);
    }

    const handleLogout = () => {
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('ID');
        localStorage.removeItem('email');
        navigate('/login');
    };

    const handleAddTrip = () => {
        navigate('/addtrip');
    };

    const handleEditTrip = (tripId: string) => {
        navigate(`/trip-details/${tripId}`);
    };

    useEffect(() => {
        const storedFirstName = localStorage.getItem('firstName');
        const storedLastName = localStorage.getItem('lastName');
        const storedEmail = localStorage.getItem('email');
        console.log("Email fetched from localStorage: ", storedEmail);

        if (storedFirstName && storedLastName && storedEmail) {
            setFirstName(storedFirstName);
            setLastName(storedLastName);
            setEmail(storedEmail);
        } else {
            navigate('/login');
        }

        // Fetch trips data
        const fetchTrips = async () => {
            try {
                const userId = localStorage.getItem("ID");
                const response = await fetch(buildPath(`api/users/${userId}/trips`));
                if (response.ok) {
                    const data = await response.json();
                    setTrips(data);
                } else {
                    console.error('Failed to fetch trips:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching trips:', error);
            }
        };

        fetchTrips();
    }, [navigate]);

    const handleDeleteTrip = async (tripId: string) => {
        try {
            const userId = localStorage.getItem("ID");

            // alert added to make sure user wants to delete 
            const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
            if (!confirmDelete) return;

            await fetch(buildPath(`api/users/${userId}/trips/${tripId}`), { method: 'DELETE' });
            setTrips(trips.filter(trip => trip._id !== tripId));
        } catch (error) {
            console.error('Error deleting trip:', error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };


    const filteredTrip = trips.filter((trip) =>{
        const searchTerm = inputValue.toLowerCase();
        const tripName = trip.name.toLowerCase();
        const tripCity = trip.city.toLowerCase();
        return tripName.includes(searchTerm) || tripCity.includes(searchTerm);
    })

    // Conditional rendering using if-else statements
        const renderTrips = () => {

            // No trips at all
            if (trips.length === 0) {
                return <div className="no-trips-message">No upcoming itineraries</div>;
            }

            // Trips exist, but no trips match the search input
            if (filteredTrip.length === 0 && inputValue) {
                return <div className="no-trips-message">Trip not found</div>;
            }

            // Trips exist and match the search input
            if (filteredTrip.length > 0) {
                return filteredTrip.map((trip) => (
                    <TripListItem
                        key={trip._id}
                        title={
                            <Link to={`/trip-details/${trip._id}`} className='trip-link'>
                                {trip.name}
                             </Link>
                        }
                        location={trip.city}
                        dates={`${trip.start_date} - ${trip.end_date}`}
                        onDelete={() => handleDeleteTrip(trip._id)}
                        onEdit={() => handleEditTrip(trip._id)} 
                    />
                ));
            }

            // Default case (fallback)
            return null;
        };

    return (
        <div className="dashboard">
            <div className='dashboard-header'>
                <div className='logo-welcome-section'>
                    <Link to="/">
                        <img src={iconlogo} alt="Xplora Logo" id="dashboard-logo" />
                    </Link>
                    <span id='welcome-text'>Welcome, {firstName} {lastName}!</span>
                </div>
                
                <div className='actions-section'>
                    {/* <button id="profile-btn"><Link to="/profile">Profile</Link></button> */}
                    <button id="profile-btn" onClick={toggleMenu}>Profile</button>
                    {isMenuOpen && (
                        // <div className="profile-menu-container open">                            
                        <div className={`profile-menu-container ${isMenuOpen ? 'open-menu' : ''}`} id="profile-menu">
                            <img src={profileicon} alt="Profile Icon" id="profile-icon" />

                            <div className="profile-info">
                                {isEditing ? (
                                    <>
                                        <input id="edit-info"
                                            type="text"
                                            value={editFirstName}
                                            onChange={(e) => setEditFirstName(e.target.value)}
                                            placeholder="First Name"
                                        />
                                        <input id="edit-info"
                                            type="text"
                                            value={editLastName}
                                            onChange={(e) => setEditLastName(e.target.value)}
                                            placeholder="Last Name"
                                        />
                                    </>
                                ) : (
                                    <div id="name">{firstName} {lastName}</div> 
                                )}
                            </div>
                            <div className="profile-info">
                                <div id="email">
                                    {isEditing ? (
                                        <input id="edit-info"
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            placeholder="Email"
                                        />
                                    ) : (
                                        email
                                    )}
                                </div>
                            </div>
                            <div className="profile-actions-section">
                                {isEditing ? (
                                    <>
                                        <button id="cancel-btn" onClick={handleCancelProfile}><img src={cancelicon} alt="Cancel" /></button>
                                        <button id="save-btn" onClick={handleSaveProfile}><img src={saveicon} alt="Save"/></button>
                                    </>
                                ) : (
                                    <button id="edit-btn" onClick={handleEditProfile}><img src={editicon} alt="Edit" /></button>
                                )}
                            </div>
                        </div>
                    )}                                                                               
                    <button id="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className='dashboard-main'>
                <div className='trip-list-container'>
                    <div className='trip-list-header'>
                        Your upcoming itineraries
                    </div>
                    <div className='search-container'>
                        <input
                            id='search-input'
                            type="text"
                            value={inputValue}
                            onChange={handleChange}
                            placeholder='Search by trip or city name...'
                        />
                        <i id="search-icon" className="fa fa-search"></i>
                    </div>
                    <button className="add-trip-btn" onClick={handleAddTrip}>+</button>


                    {renderTrips()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;