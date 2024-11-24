import React, { useState } from 'react';

interface AddFlightProps {
    onClose: () => void; // Function to close the modal
    onSave: () => void; // Function to refresh the parent list after a successful save
    apiEndpoint: string; // API endpoint for saving the flight
}

const AddFlight: React.FC<AddFlightProps> = ({ onClose,onSave, apiEndpoint }) => {
    const [flightDetails, setFlightDetails] = useState({
        departureCity: '',
        departureAirport: '',
        arrivalCity: '',
        arrivalAirport: '',
        departureDate: '',
        departureTime: '',
        arrivalDate: '',
        arrivalTime: '',
        flightNumber: '',
        confirmationNumber: '',
    });

    const [isSaving] = useState(false); // Loading indicator

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFlightDetails({ ...flightDetails, [name]: value });
    };

    const handleSubmit = async () => {
        const payload = {
            confirmation_num: flightDetails.confirmationNumber,
            flight_num: flightDetails.flightNumber,
            departure_airport: flightDetails.departureAirport,
            arrival_airport: flightDetails.arrivalAirport,
            departure_time: flightDetails.departureTime,
            arrival_time: flightDetails.arrivalTime,
            departure_date: flightDetails.departureDate,
            arrival_date: flightDetails.arrivalDate,
        };
    
        console.log('Payload being sent:', payload);
    
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                console.log('Flight added successfully');
                alert("flight added!");
               // Refresh the page
               onSave();
               onClose();
               // location.reload();
            } else {
                const errorData = await response.json();
                console.error('Error adding flight:', errorData.error);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✖</button>
                <h2>Add New Flight</h2>
                <form>
                    <div className="form-group">
                        <label>Departure City:</label>
                        <input
                            type="text"
                            name="departureCity"
                            value={flightDetails.departureCity}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Departure Airport:</label>
                        <input
                            type="text"
                            name="departureAirport"
                            value={flightDetails.departureAirport}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Arrival City:</label>
                        <input
                            type="text"
                            name="arrivalCity"
                            value={flightDetails.arrivalCity}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Arrival Airport:</label>
                        <input
                            type="text"
                            name="arrivalAirport"
                            value={flightDetails.arrivalAirport}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Departure Date:</label>
                        <input
                            type="date"
                            name="departureDate"
                            value={flightDetails.departureDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Departure Time:</label>
                        <input
                            type="time"
                            name="departureTime"
                            value={flightDetails.departureTime}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Arrival Date:</label>
                        <input
                            type="date"
                            name="arrivalDate"
                            value={flightDetails.arrivalDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Arrival Time:</label>
                        <input
                            type="time"
                            name="arrivalTime"
                            value={flightDetails.arrivalTime}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Flight Number:</label>
                        <input
                            type="text"
                            name="flightNumber"
                            value={flightDetails.flightNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirmation Number:</label>
                        <input
                            type="text"
                            name="confirmationNumber"
                            value={flightDetails.confirmationNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="button" onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Flight'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddFlight;