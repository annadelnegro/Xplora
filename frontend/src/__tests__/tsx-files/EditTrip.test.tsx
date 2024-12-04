import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTrip from '../../pages/components/EditTrip'; // Update this to your actual component path
import '../components/AddStyling.css';

// Mock `useNavigate` from `react-router-dom`
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('EditTrip Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const apiEndpoint = 'mock-api-endpoint';
  const selectedEdit = {
    title: 'Trip to Paris',
    location: 'Paris, France',
    dates: '2024-01-01 - 2024-01-07',
    notes: 'A wonderful trip!',
    pictureUrl: 'http://example.com/photo.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the EditTrip component correctly', () => {
    render(<EditTrip onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} selectedEdit={selectedEdit} />);

    // Check that the title and location fields are rendered
    expect(screen.getByLabelText(/Trip Name:/i)).toHaveValue('Trip to Paris');
    expect(screen.getByLabelText(/Trip Location:/i)).toHaveValue('Paris, France');
    expect(screen.getByLabelText(/Start Date:/i)).toHaveValue('2024-01-01');
    expect(screen.getByLabelText(/End Date:/i)).toHaveValue('2024-01-07');
    expect(screen.getByLabelText(/Notes:/i)).toHaveValue('A wonderful trip!');
  });

  it('should handle form changes correctly', () => {
    render(<EditTrip onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} selectedEdit={selectedEdit} />);

    const tripNameInput = screen.getByLabelText(/Trip Name:/i);
    fireEvent.change(tripNameInput, { target: { value: 'Updated Trip Name' } });
    expect(tripNameInput).toHaveValue('Updated Trip Name');
  });

  it('should call onSave when the form is submitted successfully', async () => {
    // Mock the fetch response for success
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<EditTrip onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} selectedEdit={selectedEdit} />);

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should handle photo upload correctly', () => {
    render(<EditTrip onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} selectedEdit={selectedEdit} />);

    const fileInput = screen.getByLabelText(/Choose File/i);
    const file = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText(file.name)).toBeInTheDocument();
  });

  it('should show error message if the file is too large', () => {
    render(<EditTrip onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} selectedEdit={selectedEdit} />);

    const fileInput = screen.getByLabelText(/Choose File/i);
    const largeFile = new File(['dummy content'], 'large-photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB, which is larger than the limit

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(screen.getByText('File size must be no larger than 5MB.')).toBeInTheDocument();
  });

  it('should navigate to dashboard after saving successfully', async () => {
    // Mock the fetch response for success
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(<EditTrip onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} selectedEdit={selectedEdit} />);

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});