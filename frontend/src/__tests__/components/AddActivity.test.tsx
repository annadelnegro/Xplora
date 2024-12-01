import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddActivity from '../../pages/components/AddActivity';

describe('AddActivity Component', () => {
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();
    const apiEndpoint = '/mock-api-endpoint';

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { reload: jest.fn() },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component and its elements', () => {
        render(<AddActivity onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} />);

        expect(screen.getByText('Add Activity')).toBeInTheDocument();

        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Location')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Date')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Time')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Notes')).toBeInTheDocument();

        expect(screen.getByText('Save Activity')).toBeInTheDocument();
    });

    test('shows error message when fields are empty and Save is clicked', () => {
        render(<AddActivity onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} />);

        const saveButton = screen.getByText('Save Activity');
        fireEvent.click(saveButton);

        
        expect(screen.getByText('All fields except notes are required.')).toBeInTheDocument();
    });

    test('calls onSave and reloads page when valid data is submitted', async () => {
        // Mock fetch API
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        ) as jest.Mock;

        render(<AddActivity onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} />);

        // Fill in all required fields
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test Activity' } });
        fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Test Location' } });
        fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: '2024-12-01' } });
        fireEvent.change(screen.getByPlaceholderText('Time'), { target: { value: '11:11' } });
        fireEvent.change(screen.getByPlaceholderText('Notes'), { target: { value: 'Memers Timers' } });

        fireEvent.click(screen.getByText('Save Activity'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(mockOnSave).toHaveBeenCalledTimes(1);
        });

        expect(global.fetch).toHaveBeenCalledWith(apiEndpoint, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
                name: 'Test Activity',
                location: 'Test Location',
                date: '2024-12-01',
                time: '11:11',
                notes: 'Memers Timers',
            }),
        }));
    });

    test('displays an error message when the API call fails', async () => {
        // Mock fetch API to return an error
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'API Error' }),
            })
        ) as jest.Mock;

        render(<AddActivity onClose={mockOnClose} onSave={mockOnSave} apiEndpoint={apiEndpoint} />);

        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test Activity' } });
        fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Test Location' } });
        fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: '2024-12-01' } });
        fireEvent.change(screen.getByPlaceholderText('Time'), { target: { value: '11:11' } });
        fireEvent.change(screen.getByPlaceholderText('Notes'), { target: { value: 'Memers Timers' } });

        fireEvent.click(screen.getByText('Save Activity'));

       
        await waitFor(() => {
            const errorMessage = screen.getByText('API Error');
            expect(errorMessage).toBeInTheDocument();
        });
    });
});
