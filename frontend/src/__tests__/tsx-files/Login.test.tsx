import { render, screen , fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../../pages/tsx-files/Login';

jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: jest.fn(),
}));

describe('LoginForm Component', () => {


  test('renders the LoginForm component with essential elements', () => {
    render(<LoginForm />);

    // Check for the title
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();

    // Check for email and password fields
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Get Exploring!')).toBeInTheDocument();

    // Check for the submit button
    expect(screen.getByText('Get Exploring!')).toBeInTheDocument();
  });

  test('shows validation errors for empty fields on submit', async () => {
    const { container } = render(<LoginForm />);
  
    const submitButton = screen.getByText('Get Exploring!');
    fireEvent.click(submitButton);
  
    // Find all error messages and assert their count
    const errorMessages = await screen.findAllByText('Required');
    expect(errorMessages).toHaveLength(2);
  
    // Check for specific field errors using the container
    const emailError = container.querySelector('.login-error-message');
    expect(emailError).toHaveTextContent('Required');
  
    const passwordError = container.querySelector('.login-error-message');
    expect(passwordError).toHaveTextContent('Required');
  });


  test('renders with pre-filled email and password fields', () => {
    render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });


  test('calls onSubmit when valid inputs are submitted', async () => {
    const { container } = render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const submitButton = screen.getByText('Get Exploring!');

    // Fill in valid inputs
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Assert no validation error messages
    const errorMessages = container.querySelectorAll('.login-error-message');
    expect(errorMessages).toHaveLength(0);
  });

});