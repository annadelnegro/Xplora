import { render, screen, fireEvent } from '@testing-library/react';
import ProfileDropdown from '../../pages/components/ProfileDropdown';
import '@testing-library/jest-dom';

module.exports = {
  setupFiles: ['../__mocks__/setupEnv.js'],
};

describe('ProfileDropdown', () => {
  const mockOnEditProfile = jest.fn();
  const mockOnSaveProfile = jest.fn();
  const mockOnCancelProfile = jest.fn();

  const defaultProps = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    id: '1',
    resetToken: 'resetToken',
    onEditProfile: mockOnEditProfile,
    onSaveProfile: mockOnSaveProfile,
    onCancelProfile: mockOnCancelProfile,
    isEditing: false,
    isMenuOpen: true,
  };

  it('renders ProfileDropdown correctly', () => {
    const { getByText } = render(<ProfileDropdown {...defaultProps} />);

    // Check if the first name is displayed
    const firstNameElement = getByText(/John/);
    expect(firstNameElement).toBeInTheDocument();

    // Check if the email is displayed
    const emailElement = getByText(/john.doe@example.com/);
    expect(emailElement).toBeInTheDocument();

    // Ensure the "Edit Profile" button exists (text-based query)
    const editButton = document.getElementById('profile-edit-button');
    expect(editButton).toBeInTheDocument();
  });
  it('calls onEditProfile when edit icon is clicked', () => {
    const props = {
      ...defaultProps,
      isEditing: false,
    };
    render(<ProfileDropdown {...props} />);
    
    const editButton = screen.getByTestId('profile-edit-button');
    expect(editButton).toBeInTheDocument();
  
    fireEvent.click(editButton);
    expect(mockOnEditProfile).toHaveBeenCalledTimes(1);
  });
  
  it('calls onSaveProfile when the save button is clicked', async () => {
    const props = {
      ...defaultProps,
      isEditing: true, // Enable editing mode
    };
    
    const { getByPlaceholderText } = render(<ProfileDropdown {...props} />);
  
    const firstNameInput = getByPlaceholderText('First Name');
    const lastNameInput = getByPlaceholderText('Last Name');
    
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    
    const saveButton = screen.getByTestId('profile-edit-button');
    fireEvent.click(saveButton);
    
    await expect(mockOnSaveProfile).toHaveBeenCalledWith('Jane', 'Doe', 'john.doe@example.com', '');
    expect(mockOnSaveProfile).toHaveBeenCalledTimes(1);
  });

  it('calls onCancelProfile when the cancel button is clicked', () => {
    const props = {
      ...defaultProps,
      isEditing: true, // Simulate editing mode
    };
    render(<ProfileDropdown {...props} />);

    // Get the cancel button by its ID
    const cancelButton = screen.getByTestId('profile-cancel-button');
    expect(cancelButton).toBeInTheDocument();

    if (cancelButton) {
      fireEvent.click(cancelButton);
    }

    expect(mockOnCancelProfile).toHaveBeenCalledTimes(1);
  });
});