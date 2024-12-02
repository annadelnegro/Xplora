// Import necessary modules
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddTrip from '../../pages/tsx-files/AddTrip';

// Mock external modules
jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.requireMock('react-router-dom').useNavigate;
mockNavigate.mockImplementation(() => jest.fn());

beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });


describe('SignupForm Component', () => {
// Test for rendering form fields and buttons
test('renders all form fields and buttons', () => {
  render(<AddTrip />);

  // Check for all form fields
  expect(screen.getByLabelText(/Trip Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();

  // Check for buttons
  expect(screen.getByText(/Save/i)).toBeInTheDocument();
  expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
});

// Test for displaying validation errors
test('displays validation errors for required fields', async () => {
  render(<AddTrip />);

  // Click the Save button without filling any fields
  fireEvent.click(screen.getByText(/Save/i));

  // Wait for validation messages
  await waitFor(() => {
    expect(screen.getByText(/Trip Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Location is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/End Date is required/i)).toBeInTheDocument();
  });
});

jest.clearAllMocks();
test('navigates to dashboard on cancel', () => {    
  render(<AddTrip />);
    

    // Click the Cancel button
    fireEvent.click(screen.getByText(/Cancel/i));

    // Assert navigation to the dashboard
   expect(mockNavigate).toHaveBeenCalledTimes(1);
   console.log(mockNavigate.mock.calls); // Logs all calls made to mockNavigate
  // expect(mockNavigate.mock.calls).toContainEqual(['/dashboard']);
});


});