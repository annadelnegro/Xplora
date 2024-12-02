import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupForm from '../../pages/tsx-files/SignUp';

// Mock react-router-dom to avoid navigation errors
jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: jest.fn(),
}));

describe('SignupForm Component', () => {
  test('renders SignupForm with essential elements', () => {
    render(<SignupForm />);

    // Check for form fields and button
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Verify Password')).toBeInTheDocument();
    expect(screen.getByText('Get Exploring!')).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });


  test('shows validation errors for empty fields on submit', async () => {
    render(<SignupForm />);

    // Simulate form submission
    fireEvent.click(screen.getByText('Get Exploring!'));

    // Wait for validation errors to appear
    const errorMessages = await screen.findAllByText('Required');

    expect(errorMessages).toHaveLength(5); 
  });

  test('shows validation errors for empty fields on submit', () => {
    const { container } = render(<SignupForm />);

    // Simulate form submission
    fireEvent.click(screen.getByText('Get Exploring!'));

    // Check validation error messages
    const errorMessages = container.querySelectorAll('.signup-error');

    expect(errorMessages).toHaveLength(5); // One for each required field

  });


});