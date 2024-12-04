import { render, fireEvent } from '@testing-library/react';
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
    const editButton = getByText(/Edit Profile/);
    expect(editButton).toBeInTheDocument();
  });

  it('calls onEditProfile when edit icon is clicked', () => {
    const { getByRole } = render(<ProfileDropdown {...defaultProps} />);

    // Use getByRole for icon buttons
    const editIcon = getByRole('button', { name: /edit profile/i });
    fireEvent.click(editIcon);

    expect(mockOnEditProfile).toHaveBeenCalledTimes(1);
  });

  it('calls onSaveProfile when save button is clicked', () => {
    const props = {
      ...defaultProps,
      isEditing: true, // Change to simulate editing mode
    };
    const { getByRole } = render(<ProfileDropdown {...props} />);

    // Check for the save button (button role)
    const saveButton = getByRole('button', { name: /save profile/i });
    fireEvent.click(saveButton);

    expect(mockOnSaveProfile).toHaveBeenCalledTimes(1);
  });

  it('calls onCancelProfile when cancel icon is clicked', () => {
    const props = {
      ...defaultProps,
      isEditing: true, // Change to simulate editing mode
    };
    const { getByRole } = render(<ProfileDropdown {...props} />);

    // Use getByRole for cancel icon button
    const cancelIcon = getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelIcon);

    expect(mockOnCancelProfile).toHaveBeenCalledTimes(1);
  });
});