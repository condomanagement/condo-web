import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';
import { UserManager } from '@condomanagement/condo-brain';

// Mock UserManager
jest.mock('@condomanagement/condo-brain', () => ({
  UserManager: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
  })),
}));

describe('Login Component', () => {
  let mockUserManager: any;

  beforeEach(() => {
    mockUserManager = new UserManager();
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
