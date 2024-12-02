import AddAccommodation from '../../pages/components/AddAccomodation';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('AddAccommodation Component', () => {
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();
    const apiEndpoint = '/mock-api-endpoint';

    test('renders the component and its elements', () => {
        render(<AddAccommodation onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} />);

        expect(screen.getByText('Add Accommodation')).toBeInTheDocument();

        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Location')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Check-In Date')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Check-In Time')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Check-Out Date')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Check-Out Time')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirmation Number')).toBeInTheDocument();

        expect(screen.getByText('Save Accommodation')).toBeInTheDocument();
    });

    test('shows error message when fields are empty and Save is clicked', () => {
        render(<AddAccommodation onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} />);

        const saveButton = screen.getByText('Save Accommodation');
        fireEvent.click(saveButton);

        
        expect(screen.getByText('All fields are required')).toBeInTheDocument();
    });

    test('calls onSave and reloads page when valid data is submitted', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        ) as jest.Mock;

        render(<AddAccommodation onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} />);

     
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test Hotel' } });
        fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Test Location' } });
        fireEvent.change(screen.getByPlaceholderText('Check-In Date'), { target: { value: '2024-12-01' } });
        fireEvent.change(screen.getByPlaceholderText('Check-Out Date'), { target: { value: '2024-12-02' } });
        fireEvent.change(screen.getByPlaceholderText('Check-In Time'), { target: { value: '11:11:11 AM' } });
        fireEvent.change(screen.getByPlaceholderText('Check-Out Time'), { target: { value: '10:11:11 PM' } });
        fireEvent.change(screen.getByPlaceholderText('Confirmation Number'), { target: { value: '123456' } });

     
        fireEvent.click(screen.getByText('Save Accommodation'));

        await waitFor(() => expect(mockOnSave).toHaveBeenCalledTimes(1));
        expect(global.fetch).toHaveBeenCalledWith(apiEndpoint, expect.any(Object));
    });

    test('displays an error message when the API call fails', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'API Error' }),
            })
        ) as jest.Mock;

        render(<AddAccommodation onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} />);

        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test Hotel' } });
        fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Test Location' } });
        fireEvent.change(screen.getByPlaceholderText('Check-In Date'), { target: { value: '2024-12-01' } });
        fireEvent.change(screen.getByPlaceholderText('Check-Out Date'), { target: { value: '2024-12-02' } });
        fireEvent.change(screen.getByPlaceholderText('Check-In Time'), { target: { value: '11:11:11 AM' } });
        fireEvent.change(screen.getByPlaceholderText('Check-Out Time'), { target: { value: '10:11:11 PM' } });
        fireEvent.change(screen.getByPlaceholderText('Confirmation Number'), { target: { value: '123456' } });

        fireEvent.click(screen.getByText('Save Accommodation'));

        await waitFor(() => expect(screen.getByText('API Error')).toBeInTheDocument());
    });
});
