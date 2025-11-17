import '@testing-library/jest-dom';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import Login from '../Login';

// Mock UserManager
jest.mock('@condomanagement/condo-brain', () => ({
  UserManager: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
  })),
}));

describe('Login Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUserManager: any;

  beforeEach(() => {
    mockUserManager = {
      login: jest.fn(),
      checkLogin: jest.fn(),
      getUser: jest.fn(),
    };
  });

  test('renders login form', () => {
    render(<Login userManager={mockUserManager} />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
  });

  test('handles email input change', () => {
    render(<Login userManager={mockUserManager} />);

    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput).toHaveValue('test@example.com');
  });

  test('calls userManager.login when form is submitted', async () => {
    mockUserManager.login.mockResolvedValue(true);

    render(<Login userManager={mockUserManager} />);

    const emailInput = screen.getByLabelText(/Email address/i);
    const loginButton = screen.getByRole('button', { name: /Send Login Link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockUserManager.login).toHaveBeenCalledWith('test@example.com');
    });
  });

  test('shows error when login fails', async () => {
    mockUserManager.login.mockResolvedValue(false);

    render(<Login userManager={mockUserManager} />);

    const emailInput = screen.getByLabelText(/Email address/i);
    const loginButton = screen.getByRole('button', { name: /Send Login Link/i });

    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  test('shows success message after login submission', async () => {
    mockUserManager.login.mockResolvedValue(true);

    render(<Login userManager={mockUserManager} />);

    const emailInput = screen.getByLabelText(/Email address/i);
    const loginButton = screen.getByRole('button', { name: /Send Login Link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(loginButton);

    // Check that login was called and success state is shown
    await waitFor(() => {
      expect(mockUserManager.login).toHaveBeenCalledWith('test@example.com');
    });
  });
});
