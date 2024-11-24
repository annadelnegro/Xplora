import React, { useState } from 'react';

interface AddAccommodationProps {
    onClose: () => void;
    onSave: () => void;
    apiEndpoint: string;
}

const AddAccommodation: React.FC<AddAccommodationProps> = ({ onClose, onSave, apiEndpoint }) => {
    const [name, setName] = useState('');
    const [address, setLocation] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [checkInTime, setCheckInTime] = useState('');
    const [checkOutTime, setCheckOutTime] = useState('');
    const [confirmationNum, setConfirmationNum] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !address || !checkInDate || !checkOutDate || !confirmationNum) {
            setError("All fields are required");
            return;
        }

        const newAccommodation = {
            name,
            confirmation_num: confirmationNum, // Convert to snake_case
            address,
            checkin_date: checkInDate, // Convert to snake_case
            checkin_time: checkInTime, // Convert to snake_case
            checkout_date: checkOutDate, // Convert to snake_case
            checkout_time: checkOutTime, // Convert to snake_case
          
        };

        console.log("sending...", newAccommodation);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAccommodation),
            });

            if (response.ok) {
                alert("Accommodation successfully added!");
                onSave();
                onClose();
            } else {
                setError("Failed to save accommodation, please try again!");
            }
        } catch (err) {
            console.error("Error adding accommodation", err);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✖</button>
                <h2>Add Accommodation</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Location:</label>
                        <input
                            type="text"
                            placeholder="Location"
                            value={address}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Check-In Date:</label>
                        <input
                            type="date"
                            placeholder="Check-In Date"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Check-In Time:</label>
                        <input
                            type="time"
                            placeholder="Check-In Time"
                            value={checkInTime}
                            onChange={(e) => setCheckInTime(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Check-Out Date:</label>
                        <input
                            type="date"
                            placeholder="Check-Out Date"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Check-Out Time:</label>
                        <input
                            type="time"
                            placeholder="Check-Out Time"
                            value={checkOutTime}
                            onChange={(e) => setCheckOutTime(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirmation Number:</label>
                        <input
                            type="text"
                            placeholder="Confirmation Number"
                            value={confirmationNum}
                            onChange={(e) => setConfirmationNum(e.target.value)}
                        />
                    </div>
                    <button type="submit">Save Accommodation</button>
                </form>
            </div>
        </div>
    );
};

export default AddAccommodation;