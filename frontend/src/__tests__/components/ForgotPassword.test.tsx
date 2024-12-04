import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPasswordPage from '../../pages/tsx-files/ForgotPassword';
import { BrowserRouter as Router } from 'react-router-dom';

module.exports = {
  setupFiles: ['../__mocks__/setupEnv.js'],
};

// Type the global fetch as a jest mock
global.fetch = jest.fn() as jest.Mock;

describe('ForgotPasswordPage Component', () => {
  test('displays an error message for invalid email input', async () => {
    render(
      <Router>
        <ForgotPasswordPage />
      </Router>
    );

    // Simulate entering an invalid email
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    // Trigger form submission
    const submitButton = screen.getByRole('button', { name: /reset my password/i });
    fireEvent.click(submitButton);

    // Wait for the error message to appear
    await waitFor(() => {
      const errorMessage = screen.getByText(/Failed to send password reset link/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});