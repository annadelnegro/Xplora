import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ForgotPasswordPage from '../../pages/tsx-files/ForgotPassword';
import { BrowserRouter as Router } from 'react-router-dom';

// Type the global fetch as a jest mock
global.fetch = jest.fn() as jest.Mock;

describe('ForgotPasswordPage Component', () => {
  const setup = () => {
    render(
      <Router>
        <ForgotPasswordPage />
      </Router>
    );
  };

  it('renders the forgot password page correctly', () => {
    setup();

    // Check if elements are rendered
    expect(screen.getByText('Forgot Your Password?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByText('Reset My Password')).toBeInTheDocument();
    expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
    expect(screen.getByText('Return to Login Page')).toBeInTheDocument();
  });

  it('displays an error message for invalid email input', async () => {
    setup();

    // Input an invalid email
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(screen.getByText('Reset My Password'));

    // Wait for validation to complete and show error message
    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  it('displays a success message when the password reset link is sent', async () => {
    // Mock a successful fetch response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Password reset link sent' }),
      })
    );

    setup();

    // Input a valid email
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText('Reset My Password'));

    // Wait for the response and check for success message
    await waitFor(() => {
      expect(screen.getByText('A password reset link has been sent to your email')).toBeInTheDocument();
    });
  });

  it('displays an error message when the password reset request fails', async () => {
    // Mock a failed fetch response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to send password reset link' }),
      })
    );

    setup();

    // Input a valid email
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText('Reset My Password'));

    // Wait for the response and check for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to send password reset link')).toBeInTheDocument();
    });
  });

  it('disables the submit button while submitting', () => {
    setup();

    // Input a valid email
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    // Click to submit and check if the button is disabled
    fireEvent.click(screen.getByText('Reset My Password'));
    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });
});