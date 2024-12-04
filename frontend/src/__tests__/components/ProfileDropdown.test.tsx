import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For better assertions
import ProfileDropdown from '../../pages/components/ProfileDropdown.tsx';

describe('ProfileDropdown Component', () => {
    const defaultProps = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: '*************',
        id: '12345',
        resetToken: 'resetToken123',
        isEditing: false,
        isMenuOpen: true,
        onEditProfile: jest.fn(),
        onSaveProfile: jest.fn(),
        onCancelProfile: jest.fn(),
    };

    it('renders profile information correctly when not editing', () => {
        render(<ProfileDropdown {...defaultProps} />);

        // Check if name, email, and buttons are rendered
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('triggers onEditProfile when Edit Profile button is clicked', () => {
        render(<ProfileDropdown {...defaultProps} />);

        const editButton = screen.getByText('Edit Profile');
        fireEvent.click(editButton);

        expect(defaultProps.onEditProfile).toHaveBeenCalledTimes(1);
    });

    it('renders input fields when in editing mode', () => {
        const editingProps = { ...defaultProps, isEditing: true };
        render(<ProfileDropdown {...editingProps} />);

        // Check if input fields are rendered
        expect(screen.getByLabelText('First Name')).toHaveValue('John');
        expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');
        expect(screen.getByLabelText('Email')).toHaveValue('johndoe@example.com');
        expect(screen.getByLabelText('Password')).toHaveValue('*************');
    });

    it('calls onSaveProfile with updated information', () => {
        const editingProps = { ...defaultProps, isEditing: true };
        render(<ProfileDropdown {...editingProps} />);

        const firstNameInput = screen.getByLabelText('First Name');
        const lastNameInput = screen.getByLabelText('Last Name');
        const saveButton = screen.getByText('Save');

        // Simulate user input
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
        fireEvent.change(lastNameInput, { target: { value: 'Smith' } });

        // Click Save
        fireEvent.click(saveButton);

        expect(defaultProps.onSaveProfile).toHaveBeenCalledWith(
            'Jane',
            'Smith',
            defaultProps.email,
            defaultProps.password
        );
    });

    it('triggers onCancelProfile when Cancel button is clicked', () => {
        const editingProps = { ...defaultProps, isEditing: true };
        render(<ProfileDropdown {...editingProps} />);

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(defaultProps.onCancelProfile).toHaveBeenCalledTimes(1);
    });

    it('does not render when menu is closed', () => {
        const closedProps = { ...defaultProps, isMenuOpen: false };
        const { container } = render(<ProfileDropdown {...closedProps} />);

        // Menu should not be rendered in the DOM
        expect(container).toBeEmptyDOMElement();
    });
});