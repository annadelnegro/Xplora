import React, { useState } from 'react';

interface AddActivityProps {
    onClose: () => void;
    onSave: () => void;
    apiEndpoint: string;
}

const AddActivity: React.FC<AddActivityProps> = ({ onClose, onSave, apiEndpoint }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for empty fields
        if (!name || !location || !date || !time) {
            setError("All fields except notes are required.");
            return;
        }

        const newActivity = {
            name,
            location,
            date,
            time,
            notes,
        };

        console.log("Payload being sent:", newActivity);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newActivity),
            });

            if (response.ok) {
                alert("Activity successfully added!");
                onSave(); // Refresh the list
                onClose(); // Close the modal
            } else {
                const responseData = await response.json();
                setError(responseData.error || "Failed to save activity, please try again!");
                console.log("Server response:", responseData);
            }
        } catch (err) {
            console.error("Error adding activity:", err);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✖</button>
                <h2>Add Activity</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Activity Name:</label>
                        <input
                            type="text"
                            placeholder="Activity Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Location:</label>
                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Time:</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Notes (Optional):</label>
                        <textarea
                            placeholder="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default AddActivity;