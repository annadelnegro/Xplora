import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../pages/tsx-files/Dashboard';
import * as router from 'react-router';
import '@testing-library/jest-dom';

// Mock the TripListItem component
jest.mock('../components/TripListItem', () => ({
  title,
  location,
  dates,
  notes,
  pictureUrl,
  onDelete,
  onEdit,
}: any) => (
  <div data-testid="trip-item">
    <h3 data-testid="trip-title">{title}</h3>
    <p data-testid="trip-location">{location}</p>
    <p data-testid="trip-dates">{dates}</p>
    <p data-testid="trip-notes">{notes}</p>
    {pictureUrl && <img data-testid="trip-picture" src={pictureUrl} alt={`${title} trip`} />}
    <button onClick={onEdit} data-testid="edit-trip-button">Edit</button>
    <button onClick={onDelete} data-testid="delete-trip-button">Delete</button>
  </div>
));

// Mock the ProfileDropdown component
jest.mock('../components/ProfileDropdown', () => ({ isEditing, firstName }: any) => (
  <div data-testid="profile-dropdown">
    {isEditing ? <span>Editing {firstName}</span> : <span>Viewing {firstName}</span>}
  </div>
));

// Mock useNavigate from react-router
const mockNavigate = jest.fn();
jest.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Set mock localStorage values
    localStorage.setItem('firstName', 'John');
    localStorage.setItem('lastName', 'Doe');
    localStorage.setItem('email', 'john.doe@example.com');
    localStorage.setItem('ID', '12345');
    localStorage.setItem('resetToken', 'mockResetToken');
  });

  afterEach(() => {
    // Clear localStorage and reset mocks
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders welcome message with user name', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const welcomeText = screen.getByText(/Welcome, John Doe!/i);
    expect(welcomeText).toBeInTheDocument();
  });

  test('renders no trips message if no trips are available', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as jest.Mock;

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      const noTripsMessage = screen.getByText(/No upcoming itineraries/i);
      expect(noTripsMessage).toBeInTheDocument();
    });
  });

  test('renders trips when available, displaying id, notes, and pictureUrl', async () => {
    const mockTrips = [
      {
        _id: '1',
        name: 'Trip to Paris',
        city: 'Paris',
        start_date: '2024-12-01',
        end_date: '2024-12-10',
        notes: 'Visit Eiffel Tower',
        picture_url: 'https://example.com/paris.jpg',
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTrips),
      })
    ) as jest.Mock;

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      const tripTitle = screen.getByText(/Trip to Paris/i);
      const tripLocation = screen.getByText(/Paris/i);
      const tripNotes = screen.getByText(/Visit Eiffel Tower/i);
      const tripDates = screen.getByText(/2024-12-01 - 2024-12-10/i);
      const tripImage = screen.getByAltText(/Trip to Paris trip/i);

      expect(tripTitle).toBeInTheDocument();
      expect(tripLocation).toBeInTheDocument();
      expect(tripNotes).toBeInTheDocument();
      expect(tripDates).toBeInTheDocument();
      expect(tripImage).toHaveAttribute('src', 'https://example.com/paris.jpg');
    });
  });

  test('handles logout and navigates to login', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('firstName')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('filters trips based on search input', async () => {
    const mockTrips = [
      {
        _id: '1',
        name: 'Trip to Paris',
        city: 'Paris',
        start_date: '2024-12-01',
        end_date: '2024-12-10',
        notes: 'Visit Eiffel Tower',
        picture_url: 'https://example.com/paris.jpg',
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTrips),
      })
    ) as jest.Mock;

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search by trip or city name/i);
      fireEvent.change(searchInput, { target: { value: 'Rome' } });

      const noTripsFound = screen.getByText(/Trip not found/i);
      expect(noTripsFound).toBeInTheDocument();
    });
  });

  test('renders profile dropdown when profile button is clicked', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const profileButton = screen.getByText(/Profile/i);
    fireEvent.click(profileButton);

    const profileDropdown = screen.getByTestId('profile-dropdown');
    expect(profileDropdown).toBeInTheDocument();
  });
});