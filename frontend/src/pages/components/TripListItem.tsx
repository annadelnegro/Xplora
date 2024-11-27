import React, { useState } from 'react';
import tripdefault from '../../images/trip_default.png'; // Replace with actual image or prop-based image
import EditTrip from '../components/EditTrip';
import { Link } from 'react-router-dom';

interface TripListItemProps {
    id: string;
    title: string;
    location: string;
    dates: string;
    pictureUrl: string | null;
    onDelete: () => void;
    onEdit: () => void;
}



const TripListItem: React.FC<TripListItemProps> = ({ id, title, location, dates, pictureUrl, onDelete, onEdit }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<any>(null);

    const handleEditClick = () => {
        const selectedTrip = { id, title, location, dates };
        console.log('Selected Trip for Editing:', selectedTrip);
        setSelectedEdit({ id, title, location, dates });
        setIsEditModalOpen(true);
    };

    return (
        <div className='trip-list-item'>
            <img src={pictureUrl || tripdefault} alt='trip picture' className='trip-image' />
            <div className='trip-details'>
                <span id='trip-title'>
                    <Link to={`/trip-details/${id}`} className='trip-link'>
                        {title}
                    </Link></span>
                <div id='trip-dates-container'>
                    <span>{location}</span><span>{dates}</span>
                </div>
            </div>
           
            <i id="trip-item-edit-icon" className='fa fa-pen-alt' onClick={handleEditClick}></i>
            <i id="trip-item-trash-icon" className='fa fa-trash-alt' onClick={onDelete}></i>

            {isEditModalOpen && selectedEdit && (
                <EditTrip
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={() => {
                        setIsEditModalOpen(false);
                        onEdit();
                    }}
                    apiEndpoint={`api/users/${localStorage.getItem('ID')}/trips/${selectedEdit?.id}`}
                    selectedEdit={selectedEdit}
                    />
                )}
        </div>
    );   
};

export default TripListItem;