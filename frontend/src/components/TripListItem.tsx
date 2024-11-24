import React from 'react';
import tripdefault from '../images/trip_default.png'; // Replace with actual image or prop-based image

interface TripListItemProps {
    title: React.ReactNode;
    location: string;
    dates: string;
    onDelete: () => void;
    onEdit: () => void;
}



const TripListItem: React.FC<TripListItemProps> = ({ title, location, dates, onDelete, onEdit }) => {
    return (
        <div className='trip-list-item'>
            <img src={tripdefault} alt='trip picture' className='trip-image' />
            <div className='trip-details'>
                <span id='trip-title'>{title}</span>
                <div id='trip-dates-container'>
                    <span>{location}</span><span>{dates}</span>
                </div>
            </div>
           
            <i id="trip-item-edit-icon" className='fa fa-pen-alt' onClick={onEdit}></i>
            <i id="trip-item-trash-icon" className='fa fa-trash-alt' onClick={onDelete}></i>
        </div>
    );
};

export default TripListItem;