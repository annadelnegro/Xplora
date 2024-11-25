import React, { useState, useEffect } from 'react';
import { Link,useParams  } from 'react-router-dom';
import '../css-files/TripDetails.css';
import logo from '../../images/logo.png';
import xploraplane from '../../images/xplora-plane.png';
import hotel from '../../images/accommodation_placeholder.png';
import tripdefault from '../../images/trip_default.png';
// import test from '../../images/test.jpg';
import { calculateTripDays } from '../helper-files/calculateTripDays';
import AddFlight from '../components/AddFlight';
import AddAccommodation from '../components/AddAccomodation';
import AddActivity from '../components/AddActivity';

const TripDetails: React.FC = () => {
    //const navigate = useNavigate();

    //    // State variables for flight details
    //    const [fromCity, setFromCity] = useState("");
    //    const [fromAirport, setFromAirport] = useState("");
    //    const [toCity, setToCity] = useState("");
    //    const [toAirport, setToAirport] = useState("");
    //    const [fromDate, setFromDate] = useState("");
    //    const [toDate, setToDate] = useState("");
   


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

    // variable states for dropdown
    const [flightsOpen, setFlightsOpen] = useState(false);
    const [accommodationsOpen, setAccommodationsOpen] = useState(false);
    const [activitiesOpen, setActivitiesOpen] = useState(false);

 
    const toggleDropdown = (dropdownType: string) => {
        if (dropdownType === 'flights') setFlightsOpen(!flightsOpen);
        if (dropdownType === 'accommodations') setAccommodationsOpen(!accommodationsOpen);
        if (dropdownType === 'activities') setActivitiesOpen(!activitiesOpen);
    };

    // const handleAdd = (type: string) => {
    //     if (type === 'flight') navigate('/add-flight');
    //     if (type === 'accommodation') navigate('/add-accommodation');
    //     if (type === 'activity') navigate('/add-activity');
    // };

    // more vairables 
    const [daysCount, setDaysCount] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    // variable states for modal/pop up 
    const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
    const [isAccomodationModalOpen, setIsAccomodationModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
        
    // variable state for trip details
    const [selectedFlight, setSelectedFlight] = useState<any>(null);
    const [selectedAccomodation, setSelectedAccomodation] = useState<any>(null);
    const [selectedActivity, setSelectedActivity] = useState<any>(null);
   
    // functions to deal with modal opening for each trip detail 
    const handleFlightClick = (flight: any) =>{
        setSelectedFlight(flight);
        setIsFlightModalOpen(true);
    }

    const handleAccomodationClick = (accommodation: any) => {
  
        setSelectedAccomodation(accommodation);
        setIsAccomodationModalOpen(true);
    };
    
    const handleActivityClick = (activity: any) => {
        setSelectedActivity(activity); 
        setIsActivityModalOpen(true);
    };

    // const closeModals = () => {
    //     setIsFlightModalOpen(false);
    //     setIsAccomodationModalOpen(false);
    //     setIsActivityModalOpen(false);
    //     setSelectedFlight(null);
    //     setSelectedAccomodation(null);
    //     setSelectedActivity(null);
    // };

    // functions for the html details that will be printed in the modals

    // flight modal
    const FlightDetailsModal: React.FC <{flight:any, onClose:() => void}> = ({flight, onClose}) =>{
        if(!flight) return null;
        
       // console.log("Flight ID:", flight);
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={onClose}>✖</button>
                    <h2>Flight Details</h2>
                    <p><strong>Flight Number:</strong> {flight.flightNumber}</p>    
                    <p><strong>Conformation Number:</strong> {flight.flightConformationNumber}</p> 
                    <p><strong>From:</strong> {flight.fromCity} ({flight.fromAirport})</p>
                    <p><strong>To:</strong> {flight.toCity} ({flight.toAirport})</p>
                    <p><strong>Departure Date:</strong> {flight.fromDate}</p>
                    <p><strong>Departure Time:</strong> {flight.departureTime}</p>
                    <p><strong>Arrival Date:</strong> {flight.toDate} </p>
                    <p><strong>Arrival Time:</strong> {flight.arrivalTime}</p>
                    <button
                    className="delete-button"
                    onClick={() => handleDeleteFlight(flight.flightId)}
                    >
                        Delete Flight
                    </button>

                </div>
        </div>
        )
    }

    //accomodation modal
    const AccommodationDetailsModal: React.FC<{ accommodation: any, onClose: () => void }> = ({ accommodation, onClose }) => {
        if (!accommodation) return null;
       // console.log("Accomodation ID:", accommodation.accommodationId);
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={onClose}>✖</button>
                    <h2>Accommodation Details</h2>
                    <p><strong>Hotel:</strong> {accommodation.name}</p>
                    <p><strong>Location:</strong> {accommodation.location}</p>
                    <p><strong>Confirmation Number:</strong> {accommodation.confirmationNum}</p>
                    <p><strong>Check-in Date:</strong> {accommodation.checkInDate}</p>
                    <p><strong>Check-in Time:</strong> {accommodation.checkIn}</p>
                    <p><strong>Check-out Time:</strong> {accommodation.checkOut}</p>
                    <p><strong>Check-out Date:</strong> {accommodation.checkOutDate}</p>
                    <button className="delete-button"
                      onClick = { () => handleDeleteAccomodation(accommodation.accommodationId)}
                      >
                      Delete Accommodation
                    </button>

                </div>
            </div>
        );
    };

    const ActivityDetailsModal: React.FC<{ activity: any, onClose: () => void }> = ({ activity, onClose }) => {
        if (!activity) return null;

        //console.log(activity);
    
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={onClose}>✖</button>
                    <h2>Activity Details</h2>
                    <p><strong>Activity:</strong> {activity.name}</p>
                    <p><strong>Location:</strong> {activity.location}</p>
                    <p><strong>Date:</strong> {activity.date}</p>


                <button className='delete-button' onClick = {() => handleDeleteActivity(activity.id)}> 
                    Delete Activiy
                </button>
                </div>

            </div>
        );
    };


 

    const [flightsList, setFlightsList] = useState<any[]>([]); // State to store the flights

    const fetchFlights = async () => {
        if(!tripId || !userId){
            console.error("missing userid or trid id")
            {
                return;
            }
        }

        console.log("trips ID:", tripId);
        console.log("User ID:", userId);
        try {

            const response = await fetch(
                buildPath(`api/users/${userId}/trips/${tripId}/flights`), 
                {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
                
            );

        
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched flights:", data);
                setFlightsList(data); 
            } else {
                console.error("Failed to fetch flights:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
        

    }

    const [activitiesList, setActivitiesList] = useState<any[]>([]);

    const fetchActivities = async () =>{
        if(!tripId || !userId){
            console.error("missing userid or trid id")
            {
                return;
            }
        }

        // connect to the api, and store response
        try{
            const response = await fetch(buildPath(`api/users/${userId}/trips/${tripId}/activities`),
            {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                },
            }

        );

        // if response is ok, put the data into a varariable state
        if(response.ok){
            const data = await response.json();
            console.log("Fetch Activities", data);
            setActivitiesList(data);

        }
        // else, error, fun...
        else{
            console.error("Error fetching activities:", response.statusText);
        }
        

        }catch(error){
            console.error("Error fetching activities:", error);
        }
    }


    // fetch accomodation list 
    const [accomodationList, setAccomodationList] = useState<any[]>([]);
    const fetchAccomodation = async () =>{
        if(!tripId || !userId){
            console.error("missing userid or trid id")
            {
                return;
            }
        }
        try{

            const response = await fetch(buildPath(`api/users/${userId}/trips/${tripId}/accommodations`),{
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
            );

            if (response.ok){
                const data = await response.json();
                console.log("Fetched Accomodation", data);
                setAccomodationList(data)
            }
            else{
                console.error("Failed to fetch accomodation:", response.statusText);
            }
        }catch(error){
            console.error("Error fethching accomodations", error)
        }
    }



    ////// ADDS DETAILS MODAL//////////


    //flight
    const [isAddFlightModalOpen, setIsAddFlightModalOpen] = useState(false);
    const openAddFlightModal = () => setIsAddFlightModalOpen(true);
    const closeAddFlightModal = () => setIsAddFlightModalOpen(false);

    const refreshFlightList = async () => {
        await fetchFlights(); // Fetch the updated flight list
    };
    const addFlightApiEndpoint = buildPath(`api/users/${userId}/trips/${tripId}/flights`);


    //accomodation
    const [isAddAccommodationModalOpen, setIsAddAccommodationModalOpen] = useState(false);

    const openAddAccommodationModal = () => setIsAddAccommodationModalOpen(true);
    const closeAddAccommodationModal = () => setIsAddAccommodationModalOpen(false);

    const refreshAccomocationList = async () =>{
        await fetchAccomodation();
    };

    const addAccomodationApiEndpoint = buildPath(`api/users/${userId}/trips/${tripId}/accommodations`);


    //activty

    const [isAddActivityModal, setAddActivityModal] = useState(false);

    const openAddActivityModal = () =>{
        setAddActivityModal(true);
    };

    const closeAddActivityModal = () => {
        setAddActivityModal(false);
    }

    const refreshActivityList = async () =>{
        await fetchActivities();
    };

    const addActivityApiEndppoint = buildPath(`api/users/${userId}/trips/${tripId}/activities`)


    //DELETE DETAILS

    const handleDeleteFlight = async (flightId: string) =>{
        try{
            if(!tripId && !userId ){
                return;
            }

            const confirmDelete = window.confirm("Are you sure you want to delete the trip");
            if(!confirmDelete){
                return;
            }

            const response = await fetch(buildPath(`api/users/${userId}/trips/${tripId}/flights/${flightId}`),{
                method: "DELETE",
                headers: {'Content-Type' : 'application/json'},
            }

            );


            if(response.ok){
                refreshFlightList();
                setIsFlightModalOpen(false);
            }
            else{
                const data = await response.json();
                console.error("error deleting flight", data.error);
            }

        }catch(error){
            console.log(error)
        }
    }

    const handleDeleteAccomodation = async (AccomodationId: string) =>{
        if (!userId || !tripId){
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete the trip");
            if(!confirmDelete){
                return;
            }

        try{
            const response = await fetch(buildPath(`api/users/${userId}/trips/${tripId}/accommodations/${AccomodationId}`),
            {
                method: "DELETE",
                headers:{'Content-type' : 'application/json'},
            }

        );

        if(response.ok){
            refreshAccomocationList();
            setIsAccomodationModalOpen(false);
        }
        else{
            console.error("error deleting the accomodation", response.statusText);
        }



        }catch(error){
            console.log(error);
        }
    }

    const handleDeleteActivity = async (ActivityId: string) =>{
        const confirmdelete = window.confirm("Are you sure you want to delete this activity");
        if(!confirmdelete) return;

        try{

            const response = await fetch(buildPath(`api/users/${userId}/trips/${tripId}/activities/${ActivityId}`),{
                method: "DELETE",
                headers: {'Content-type' : 'application/json'}

            }
        );

        if(response.ok){
            refreshActivityList();
            setIsActivityModalOpen(false);
        }
        else{
            console.error("error deleting the accomodation", response.statusText);
        }

        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        // Fetch trip details using the tripId and userId, and calculate days
        const fetchTripDetails = async () => {
            if (!tripId || !userId){
                console.error('Missing tripId or userId');
                return;
            }
            try {
                    const response = await fetch(buildPath(`api/users/${userId}/trips/${tripId}`)); 
                    //console.log('Response:', response);
                    if (response.ok) {
                        const data = await response.json();
                        
                        // Set the fetched data into state
                        setTripName(data.name);
                        //console.log('Fetched tripName:', data.name);
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
    
        // Call the function to fetch trip details/flight/accomodation
        fetchTripDetails();
        fetchFlights();
        fetchAccomodation();
        fetchActivities();
    }, [tripId, userId]);






    return (
        <div className="trip-details-page">
            <header className="tripdetails-header">
                <Link to="/dashboard">
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
                                <img src={pictureUrl || tripdefault } alt="Image Trip" className="tripdetails-image" />
                            </div>
                        </div>

                        <div className="note-box">
                            <p className='notes-styling'>{notes || 'No additional notes'}</p>
                        </div>
                    </div>

                    {/* Dropdown Sections */}
                    <div className="dropdown-all">
                        <div className="dropdown-section">
                            <div className="dropdown-header" onClick={() =>{
                                toggleDropdown('flights')


                            } }>
                                <span className="text">Flights</span>
                                <span className={`arrow ${flightsOpen ? 'open' : ''}`}>▼</span>
                                <div className="tooltip-container">
                                    <button
                                        className="add-button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent dropdown toggle
                                            openAddFlightModal(); // Open add flight modal
                                        }}
                                    >+</button>
                                    <span className="tooltip-text">Add new flight</span>
                                </div>
                            </div>
                            {flightsOpen &&
                        <div className="flights-list">
                            {flightsList.length > 0 ? (
                                flightsList.map((flight, index) => (
                                    <div
                                        key={index}
                                        className="flight-details"
                                        onClick={() => handleFlightClick({
                                            fromCity: flight.departure_city,
                                            fromAirport: flight.departure_airport,
                                            toCity: flight.arrival_city,
                                            toAirport: flight.arrival_airport,
                                            fromDate: flight.departure_date,
                                            toDate: flight.arrival_date,
                                            departureTime: flight.departure_time, 
                                            arrivalTime: flight.arrival_time, 
                                            flightNumber: flight.flight_num,
                                            flightConformationNumber: flight.confirmation_num,
                                            flightId: flight._id
                                            
                                        })
                                    }
                                    
                                    >
                                        <div className="top-info">
                                            <span id="from-airport">{flight.departure_airport}</span>
                                            <div className="airport-separation-line">
                                                <img src={xploraplane} alt="Airplane Icon" className="airplane-icon" />
                                            </div>
                                            <span id="dest-airport">{flight.arrival_airport}</span>
                                        </div>
                                        <div className="bottom-info">
                                            <div className="from-info">
                                                <span id="from-city">{flight.departure_city}</span>
                                                <span id="from-date">{flight.departure_date}</span>
                                            </div>
                                            <div className="dest-info">
                                                <span id="dest-city">{flight.arrival_city}</span>
                                                <span id="dest-date">{flight.arrival_date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                            <p className='dropdown-accommodation-empty'>No flights yet! Click <span className='plus'>+</span> button to add a flight.</p>
                            )}
                        </div>
                    }
                        </div>

                        <div className="dropdown-section">
                            <div className="dropdown-header" onClick={() => toggleDropdown('accommodations')}>
                                <span className="text">Accommodations</span>
                                <span className={`arrow ${accommodationsOpen ? 'open' : ''}`}>▼</span>
                                <div className="tooltip-container">
                                    <button className="add-button"
                                       onClick={(e) => {
                                        e.stopPropagation(); // Prevent dropdown toggle
                                        openAddAccommodationModal(); // Open add flight modal
                                    }}
                                     >+</button>
                                    <span className="tooltip-text">Add new accommodation</span>
                                </div>
                            </div>

                            {/* Conditionally render dropdown content */}
                            {accommodationsOpen && (
                                accomodationList.length > 0 ? (
                                    <div className="accommodations-list">
                                        {accomodationList.map((accommodation, index) => (
                                            <div
                                                key={index}
                                                className="accommodation-details"
                                                onClick={() =>
                                                    handleAccomodationClick({
                                                        name: accommodation.name,
                                                        location: accommodation.address,
                                                        checkIn: accommodation.checkin_time,
                                                        checkOut: accommodation.checkout_time,
                                                        checkOutDate: accommodation.checkout_date,
                                                        checkInDate: accommodation.checkin_date,
                                                        confirmationNum: accommodation.confirmation_num,
                                                        accommodationId: accommodation._id,
                                                    })
                                                }
                                            >
                                                <div className="top-acc-info">
                                                    <div>
                                                        <img src={hotel} alt="Accommodation Icon" className="accommodation-icon" />
                                                    </div>
                                                    <div className="accommodation-title">
                                                        <span className="your-stay-at">
                                                            Your stay at{' '}
                                                            <span className="accommodation-name">{accommodation.name}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="from-dest-deets">
                                                    <span id="from-deets">Check-In</span>
                                                    <span id="dest-deets">Check-Out</span>
                                                </div>
                                                <div className="bottom-acc-info">
                                                    <div className="from-acc-info">
                                                        <span id="accommodation-from-date">{accommodation.checkin_date}</span>
                                                        <span id="accommodation-from-time">{accommodation.checkin_time}</span>
                                                    </div>
                                                    <div className="dest-acc-info">
                                                        <span id="accommodation-destination-date">{accommodation.checkout_date}</span>
                                                        <span id="accommodation-destination-time">{accommodation.checkout_time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="dropdown-accommodation-empty">
                                            No accommodations yet! Click <span className='plus'>+</span> button to add an accommodation.
                                    </p>
                                )
                            )}
                        </div>


                        <div className="dropdown-section">
                            <div className="dropdown-header" onClick={() => toggleDropdown('activities')}>
                                <span className="text">Activities</span>
                                <span className={`arrow ${activitiesOpen ? 'open' : ''}`}>▼</span>
                                <div className="tooltip-container">
                                    <button className="add-button"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent dropdown toggle
                                        openAddActivityModal(); // Open add flight modal
                                      }}
                                        >+</button>
                                    <span className="tooltip-text">Add new activity</span>
                                </div>
                            </div>
                            {activitiesOpen && (
                                <div className="activities-list">
                                    {activitiesList.length > 0 ? (
                                        activitiesList.map((activity, index) => (
                                            <div
                                                key={index}
                                                className="activity-details"
                                                onClick={() =>
                                                    handleActivityClick({
                                                        name: activity.name,
                                                        location: activity.location,
                                                        date: activity.date,
                                                        id: activity._id,
                                                    })
                                                }
                                            >
                                                <p><strong>Activity:</strong> {activity.name}</p>
                                                <p><strong>Location:</strong> {activity.location}</p>
                                                <p><strong>Date:</strong> {activity.date}</p>
                                            </div>
                                        ))
                                    ) : (
                                            <p className='dropdown-accommodation-empty'>No activities yet! Click <span className='plus'>+</span> button to add an activity.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

             {/* Render Flight Modals */}
             {isFlightModalOpen && selectedFlight && (
                <FlightDetailsModal
                    flight={selectedFlight}
                    onClose={() => {
                        setIsFlightModalOpen(false);
                        setSelectedFlight(null);
                    }}
                />
            )}

            {/*Render Accomodation Modals*/}
            {isAccomodationModalOpen && selectedAccomodation && (
                <AccommodationDetailsModal 
                    accommodation={selectedAccomodation}
                    onClose={() =>{
                        setIsAccomodationModalOpen(false); 
                        setSelectedAccomodation(null);
                    }}
                />
            )}

            {isActivityModalOpen && selectedActivity && (
                <ActivityDetailsModal
                    activity={selectedActivity}
                    onClose={() =>{
                        setIsActivityModalOpen(false);
                        setSelectedActivity(null);
                    }}
                />
            )}


            {/*Interface */}
            {isAddFlightModalOpen && (
                <AddFlight
                    onClose={closeAddFlightModal}
                    onSave={refreshFlightList}
                    apiEndpoint={addFlightApiEndpoint}
                />
            )}

           
            {isAddAccommodationModalOpen && (
                <AddAccommodation
                    onClose={closeAddAccommodationModal} 
                    onSave={refreshAccomocationList} 
                    apiEndpoint={addAccomodationApiEndpoint}
                />
            )}

            {isAddActivityModal && (
                <AddActivity
                onClose = {closeAddActivityModal}
                onSave = {refreshActivityList}
                apiEndpoint={addActivityApiEndppoint}
                />
            )}
                        
        </div>
    );
};

export default TripDetails;
