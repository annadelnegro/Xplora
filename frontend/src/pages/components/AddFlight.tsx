import React, { useState } from 'react';
import '../components/AddStyling.css';

interface AddFlightProps {
    onClose: () => void; // Function to close the modal
    onSave: () => void; // Function to refresh the parent list after a successful save
    apiEndpoint: string; // API endpoint for saving the flight
}

const AddFlight: React.FC<AddFlightProps> = ({ onClose, onSave, apiEndpoint }) => {

    const [confirmationNum, setConfirmationNum] = useState('');
    const [flightNumber, setFlightNumber] = useState('');
    const [departureAirport, setDepartureAirport] = useState(''); 
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalAirport, setArrivalAirport] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [error, setError] = useState('');

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const SuccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
        return (
            <div className="modal-overlay-alert" onClick={onClose}>
                <div className="modal-content-alert" onClick={(e) => e.stopPropagation()}>
                    <h2>Success</h2>
                    <p>Your Flight has been added successfully!</p>
                    <button onClick={onClose}>OK</button>
                </div>
            </div>
        );
    };
    
    // const [flightDetails, setFlightDetails] = useState({
    //     departureAirport: '',
    //     arrivalAirport: '',
    //     departureDate: '',
    //     departureTime: '',
    //     arrivalDate: '',
    //     arrivalTime: '',
    //     flightNumber: '',
    //     confirmationNumber: '',
    // });

    //console.log('Flight details', flightDetails);

    //const [isSaving] = useState(false);

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setFlightDetails({ ...flightDetails, [name]: value });
    // };


    //const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!departureAirport || !arrivalAirport || !departureDate
            || !departureTime || !arrivalDate || !arrivalTime || !flightNumber ||!confirmationNum
        ){
            setError("All fields are required");
            return;
        }
        const newFlight = {
            confirmation_num: confirmationNum,
            flight_num: flightNumber,
            departure_airport: departureAirport,
            arrival_airport: arrivalAirport,
            departure_time: departureTime,
            arrival_time: arrivalTime,
            departure_date: departureDate,
            arrival_date: arrivalDate,
        };
    
        console.log('Payload being sent:', newFlight);
    
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newFlight),
            });
    
            if (response.ok) {
                console.log('Flight added successfully');
                onSave();
                location.reload();
            } else {
                const responseData = await response.json();
                setError(responseData.error || "Failed to save flight, please try again!");
                // console.error('Error adding flight:', errorData.error);
                // setError(errorData.error || "An unexpected error occurred");
            }
        } catch (error) {
            // setError("Failed to submit. Please try again.");
            console.error('Unexpected error:', error);
        }
    };



    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✖</button>
                <h2>Add New Flight</h2>
                {/* <form> */}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Confirmation Number:</label>
                        <input
                            type="text"
                            placeholder="Confirmation Number"
                            // name="confirmationNumber"
                            value={confirmationNum}
                            onChange={(e) => setConfirmationNum(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Flight Number:</label>
                        <input
                            type="text"
                            placeholder="Flight Number"
                            // name="flightNumber"
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Departure Airport:</label>
                        <input
                            type="text"
                            placeholder="Departure Airport"
                            // name="departureAirport"
                            value={departureAirport}
                            onChange={(e) => setDepartureAirport(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Departure Date:</label>
                        <input
                            type="date"
                            placeholder="Departure Date"
                            // name="departureDate"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Departure Time:</label>
                        <input
                            type="time"
                            placeholder="Departure Time"
                            // name="departureTime"
                            value={departureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Arrival Airport:</label>
                        <input
                            type="text"
                            placeholder="Arrival Airport"
                            // name="arrivalAirport"
                            value={arrivalAirport}
                            onChange={(e) => setArrivalAirport(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Arrival Date:</label>
                        <input
                            type="date"
                            placeholder="Arrival Date"
                            // name="arrivalDate"
                            value={arrivalDate}
                            onChange={(e) => setArrivalDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Arrival Time:</label>
                        <input
                            type="time"
                            placeholder="Arrival Time"
                            // name="arrivalTime"
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                        />
                    </div>
                    {/* <button className='submit-flight' type="button" onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Flight'}
                    </button> */}
                    <button className='submit-flight' type="submit">
                        Save Flight
                        {/* {isSaving ? 'Saving...' : 'Save Flight'} */}
                    </button>
                </form>
            </div>
            {isSuccessModalOpen && <SuccessModal onClose={() => {
                setIsSuccessModalOpen(false);
                onClose(); // Close the main modal
            }} />}
        </div>
    );
};

export default AddFlight;

