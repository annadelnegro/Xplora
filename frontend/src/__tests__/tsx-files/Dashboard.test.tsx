import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../pages/tsx-files/Dashboard';

module.exports = {
  setupFiles: ['../__mocks__/setupEnv.js'],
};

// Mock the TripListItem component
jest.mock('../../pages/components/TripListItem', () => (props: any) => (
  <div data-testid="trip-item">
    <h3 data-testid="trip-title">{props.title}</h3>
    <p data-testid="trip-location">{props.location}</p>
    <p data-testid="trip-dates">{props.dates}</p>
    <p data-testid="trip-notes">{props.notes}</p>
    {props.pictureUrl && <img data-testid="trip-picture" src={props.pictureUrl} alt={`${props.title} trip`} />}
    <button onClick={props.onEdit} data-testid="edit-trip-button">Edit</button>
    <button onClick={props.onDelete} data-testid="delete-trip-button">Delete</button>
  </div>
));

// Mock the ProfileDropdown component
jest.mock('../../pages/components/ProfileDropdown', () => ({ isEditing, firstName }: any) => (
  <div data-testid="profile-dropdown">
    {isEditing ? <span>Editing {firstName}</span> : <span>Viewing {firstName}</span>}
  </div>
));

// Mock the entire `react-router-dom` module to avoid TextEncoder usage
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: () => jest.fn(),
}));


const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

global.TextEncoder = class TextEncoder {
  encode(input: string): Uint8Array {
    return new Uint8Array([...Buffer.from(input)]);
  }
} as unknown as typeof TextEncoder;

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
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders welcome message with user name', () => {
    render(<Dashboard />);
    const welcomeText = document.getElementById('welcome-text');
    expect(welcomeText).toBeInTheDocument();
  });

  test('renders no trips message if no trips are available', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as jest.Mock;

    render(<Dashboard />);
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

    render(<Dashboard />);
    await waitFor(() => {
      const tripTitle = screen.getByText(/Trip to Paris/i);
      const tripLocation = screen.getByTestId('trip-location');
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
    render(<Dashboard />);
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('firstName')).toBeNull();
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

    render(<Dashboard />);
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search by trip or city name/i);
      fireEvent.change(searchInput, { target: { value: 'Rome' } });

      const noTripsFound = screen.getByText(/Trip not found/i);
      expect(noTripsFound).toBeInTheDocument();
    });
  });

  test('renders profile dropdown when profile button is clicked', () => {
    render(<Dashboard />);
    const profileButton = screen.getByText(/Profile/i);
    fireEvent.click(profileButton);

    const profileDropdown = screen.getByTestId('profile-dropdown');
    expect(profileDropdown).toBeInTheDocument();
  });
});