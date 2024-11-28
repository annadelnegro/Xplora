import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css-files/EditTrip.css';

interface TabContent {
    id: number;
    text: string;
}

const EditTrip: React.FC = () => {
    // Track which dropdown is currently open
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Control the modal visibility and content
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<string>('');

    // Track which tab is in edit mode
    const [isEditing, setIsEditing] = useState<string | null>(null);

    // Store the new item text for adding items to a tab
    const [newItemText, setNewItemText] = useState<string>('');

    // Manage the content for each tab, with initial data for activities, flight, and accommodation
    const [tabContents, setTabContents] = useState<{ [key: string]: TabContent[] }>({
        activities: [
            { id: 1, text: 'Activity 1' },
            { id: 2, text: 'Activity 2' },
            { id: 3, text: 'Activity 3' }
        ],
        flight: [
            { id: 1, text: 'Flight Details' },
            { id: 2, text: 'Check-in Information' }
        ],
        accommodation: [
            { id: 1, text: 'Hotel Details' },
            { id: 2, text: 'Booking Information' }
        ]
    });

    // Toggle the visibility of a dropdown for a specific tab
    const toggleDropdown = (tab: string) => {
        // If the clicked tab is already open, close it. Otherwise, open the new tab
        setActiveDropdown(activeDropdown === tab ? null : tab);
    };

    // Open the modal and set its content
    const openModal = (content: string) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    // Close the modal and clear its content
    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent('');
    };

    // Enable edit mode for a specific tab
    const startEditing = (tab: string) => {
        setIsEditing(tab);
    };

    // Update the text of a specific item in a tab
    const handleEditChange = (tab: string, id: number, newText: string) => {
        setTabContents(prevContents => ({
            ...prevContents,
            [tab]: prevContents[tab].map(item =>
                item.id === id ? { ...item, text: newText } : item
            )
        }));
    };

    // Delete a specific item from a tab
    const handleDelete = (tab: string, id: number) => {
        setTabContents(prevContents => ({
            ...prevContents,
            [tab]: prevContents[tab].filter(item => item.id !== id)
        }));
    };

    // Save changes and exit edit mode
    const saveChanges = () => {
        setIsEditing(null);
    };

    // Add a new item to a specific tab
    const handleAddItem = (tab: string) => {
        // Prevent adding empty items
        if (newItemText.trim() === '') return;

        setTabContents(prevContents => ({
            ...prevContents,
            [tab]: [
                ...prevContents[tab],
                { id: Date.now(), text: newItemText } // Use current timestamp as unique id
            ]
        }));
        setNewItemText(''); // Clear input after adding
    };

    return (
        <div className="dashboard">
            {/* Header with logo and navigation */}
            <header className="homepage-header">
                <nav className="homepage-nav">
                    <ul>
                        {/* Navigation items if needed */}
                    </ul>
                </nav>
            </header>

            <div className="dashboard-i-container">
                <div className="dashboard-i-header">Where the adventure starts</div>
                <div className="dashboard-i-content">
                    {/* Trip card with basic trip details */}
                    <div className="trip-card">
                        <div className="trip-details">
                            <h3 className="trip-name">
                                <Link to="/trip-details">Trip to NYC</Link>
                            </h3>
                            <p className="trip-location">New York City</p>
                            <p className="trip-dates">2024-12-01 - 2024-12-05 (5 days)</p>
                        </div>
                        
                    </div>

                    {/* Tabs for Activities, Flight, and Accommodation */}
                    <div className="edit-trip-tabs">
                        {['activities', 'flight', 'accommodation'].map((tab) => (
                            <div key={tab} className="edit-trip-tab">
                                <div className="edit-trip-tab-header">
                                    {/* Dropdown button to show or hide content for the tab */}
                                    <button onClick={() => toggleDropdown(tab)} className="edit-trip-dropdown-button">
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                    
                                    {/* Edit button, only enabled if the dropdown is open */}
                                    <button 
                                        className="edit-trip-tab-button" 
                                        aria-label="Edit" 
                                        onClick={() => startEditing(tab)}
                                        disabled={activeDropdown !== tab} // Disable if the dropdown is not open
                                        style={{
                                            opacity: activeDropdown === tab ? 1 : 0.5, // Optional visual cue when disabled
                                            cursor: activeDropdown === tab ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        ✏️
                                    </button>
                                </div>
                                
                                {/* Dropdown content for the tab, only shown if the dropdown is active */}
                                {activeDropdown === tab && (
                                    <div className="edit-trip-dropdown-content">
                                        {/* Display each item in the tab */}
                                        {tabContents[tab].map((item) => (
                                            <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                                                {/* Input for editing item text if in edit mode, otherwise show as text */}
                                                {isEditing === tab ? (
                                                    <input
                                                        type="text"
                                                        value={item.text}
                                                        onChange={(e) => handleEditChange(tab, item.id, e.target.value)}
                                                    />
                                                ) : (
                                                    <p onClick={() => openModal(item.text)}>{item.text}</p>
                                                )}

                                                {/* Delete button only shown in edit mode */}
                                                {isEditing === tab && (
                                                    <button
                                                        onClick={() => handleDelete(tab, item.id)}
                                                        className="delete-button"
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {/* Add item input and buttons for adding and saving changes */}
                                        {isEditing === tab && (
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Add new item"
                                                    value={newItemText}
                                                    onChange={(e) => setNewItemText(e.target.value)}
                                                    className="add-item-input"
                                                />
                                                <button onClick={() => handleAddItem(tab)} className="add-button">
                                                    Add
                                                </button>
                                                <button onClick={saveChanges} className="save-button">Save Changes</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal for viewing details of an item */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-button" onClick={closeModal}>✖️</button>
                        <h2>Activity Details</h2>
                        <p>{modalContent}</p> {/* Placeholder content */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditTrip;