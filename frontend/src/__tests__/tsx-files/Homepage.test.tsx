import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../pages/tsx-files/HomePage';

// Mock `useNavigate`
jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: jest.fn(),
}));

// Create a mock implementation for `useNavigate`
const mockNavigate = jest.requireMock('react-router-dom').useNavigate;
mockNavigate.mockImplementation(() => jest.fn());

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to avoid interference
  });

  test('renders the homepage with essential elements', () => {
    render(<HomePage />);

    // Check for logo and main content
    expect(screen.getByAltText('Xplora Logo')).toBeInTheDocument();

    const header = screen.getByRole('heading', { level: 1 });
    expect(header).toHaveTextContent("Let's XPLORA Place Together!");
    // Check for buttons
    expect(screen.getByText('Sign In', { selector: '#r-login-btn div' })).toBeInTheDocument();
    expect(screen.getByText('Sign Up', { selector: '#r-register-btn div' })).toBeInTheDocument();
    expect(screen.getByText('Xplore NOW!')).toBeInTheDocument();
  });

  
  test('navigates to sign-up when "Xplore NOW!" is clicked', () => {
    render(<HomePage />);

        // Simulate clicking the "Xplore NOW!" button
        const getStartedButton = screen.getByText('Xplore NOW!');
        fireEvent.click(getStartedButton);
    
        // Assert that the URL is updated to '/sign-up'
        expect(window.location.pathname).toBe('/');

  });
});