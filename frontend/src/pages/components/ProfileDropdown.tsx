import React, { useState } from 'react';
import * as yup from 'yup';
import '../css-files/Dashboard.css'
import defaultprofile from '../../images/default_profile.png';

interface ProfileDropdownProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    onEditProfile: () => void;
    // onSaveProfile: () => void;
    onSaveProfile: (newFirstName: string, newLastName: string, newEmail: string, newPassword: string) => void;
    onCancelProfile: () => void;

    isEditing: boolean;
    isMenuOpen: boolean;
}

const passwordChangeSchema = yup.object().shape({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup
        .string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[\W_]/, 'Password must contain at least one special character'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
});




const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ firstName, lastName, email, password, onEditProfile, onSaveProfile, onCancelProfile, isEditing, isMenuOpen }) => {
    const [newFirstName, setNewFirstName] = useState<string>(firstName);
    const [newLastName, setNewLastName] = useState<string>(lastName);
    const [newEmail, setNewEmail] = useState<string>(email);
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 
    

    const handleSaveChange = async () => {
        const passwordData = {
            currentPassword: currentPassword, 
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };
    
        const actualPassword = password;
    
        try {
            await passwordChangeSchema.validate(passwordData, { abortEarly: false });
    
            if (currentPassword !== actualPassword) {
                // alert("Current password is incorrect.");
                setErrorMessage("Current password is incorrect.");
                return;
            }
    
            onSaveProfile(newFirstName, newLastName, newEmail, newPassword);

            setErrorMessage(null);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const validationErrors = error.inner.map((err) => err.message);
                // console.error("Validation errors:", validationErrors);
                setErrorMessage(validationErrors.join("\n"));
            }
        }
    };
    
    return(
        <div className={`profile-menu-container ${isMenuOpen ? 'open-menu' : ''}`} id="profile-menu">          
            {/* Conditional classNames based on isEditing status */}
            <div className={`profile-info ${isEditing ? "editing" : ""}`}>                           
                {isEditing ? (
                    <>
                        <div className="profile-img-container">
                            <img src={defaultprofile} alt="Profile Icon"/>  
                            <i id="edit-profile-img-icon" className="fa fa-pen"></i>
                        </div>
                        <div className="edit-info">
                            <input id="edit-first-name"
                                type="text"
                                value={newFirstName}
                                onChange={
                                    (e) => setNewFirstName(e.target.value)
                                }
                                placeholder="First Name"
                            />
                            <input id="edit-last-name"
                                type="text"
                                value={newLastName}
                                onChange={
                                    (e) => setNewLastName(e.target.value)
                                }
                                placeholder="Last Name"
                            />
                        </div>

                        {/* <div className={`error-flag ${errorMessage ? 'show' : ''}`}>
                            <span>{errorMessage}</span>
                        </div> */}
                    </>
                ) : (
                    <>
                        {/* <div className="profile-img-container"> */}
                            <img className="img-name" src={defaultprofile} alt="Profile Icon"/>
                            <div className="img-name" id="name"><h2 id="profile-menu">{firstName} {lastName}</h2></div>
                        {/* </div> */}
                    </> 
                )}
            </div>
            <div className={`profile-info ${isEditing ? "editing" : ""}`}>
                    {isEditing ? (
                        <>
                            <div className='edit-info'>
                                <input id="email"
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Email"
                                />
                            </div>

                            <div className={`error-flag ${errorMessage ? 'show' : ''}`}>
                                <span>{errorMessage}</span>
                            </div>
                        </>
                    ) : (
                        <div className="edit-info">{email}</div>
                    )}
            </div>
            <div className={`profile-info ${isEditing ? "editing" : ""}`}>
                    {isEditing ? (
                        <>
                            <div className="edit-info">
                                <div className="password-field">
                                    <input id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Current Password"
                                    />

                                    <div className={`error-flag ${errorMessage ? 'show' : ''}`}>
                                        <span>{errorMessage}</span>
                                    </div>
                                </div>
                                
                                <div className="password-field">
                                    <input id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New Password"
                                    />

                                    <div className={`error-flag ${errorMessage ? 'show' : ''}`}>
                                        <span>{errorMessage}</span>
                                    </div>
                                </div>

                                <div className="password-field">
                                    <input id="confirm-new-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm New Password"
                                    />

                                    <div className={`error-flag ${errorMessage ? 'show' : ''}`}>
                                        <span>{errorMessage}</span>
                                    </div>
                                </div>
                            </div>
                        </>

                    ) : (
                        <>
                            <div className="edit-info">{password}</div>
                        </>

                    )}
            </div>
            <div className={`profile-info ${isEditing ? "editing" : ""}`}>
                {isEditing ? (
                    <>
                        <i id="profile-cancel-icon" className='far fa-times-circle' onClick={onCancelProfile}></i>
                        <i id="profile-save-icon" className='far fa-check-circle' onClick={handleSaveChange}></i>
                    </>
                ) : (
                    <>
                        <i id="profile-cancel-icon" className='far fa-times-circle' onClick={onCancelProfile}></i>
                        <i id="profile-edit-icon" className='fa fa-edit' onClick={onEditProfile}></i>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileDropdown;