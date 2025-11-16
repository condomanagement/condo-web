import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Authenticate from '../Authenticate';
import { UserManager } from '@condomanagement/condo-brain';

// Mock dependencies
jest.mock('@condomanagement/condo-brain', () => ({
  UserManager: jest.fn().mockImplementation(() => ({
    processLogin: jest.fn(),
    loggedIn: false,
  })),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Authenticate Component', () => {
  let mockUserManager: any;

  beforeEach(() => {
    mockUserManager = new UserManager();
    mockUserManager.processLogin = jest.fn();
    mockNavigate.mockClear();
  });

  test('renders authentication loading state', () => {
    mockUserManager.processLogin.mockResolvedValue(true);
    
    render(
      <MemoryRouter initialEntries={['/authenticate/test-key-123']}>
        <Routes>
          <Route path="/authenticate/:emailKey" element={<Authenticate userManager={mockUserManager} />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Validating Account')).toBeInTheDocument();
    expect(screen.getByText('Validating your account')).toBeInTheDocument();
  });

  test('calls processLogin with email key from URL', async () => {
    mockUserManager.processLogin.mockResolvedValue(true);
    
    render(
      <MemoryRouter initialEntries={['/authenticate/test-email-key-123']}>
        <Routes>
          <Route path="/authenticate/:emailKey" element={<Authenticate userManager={mockUserManager} />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(mockUserManager.processLogin).toHaveBeenCalledWith('test-email-key-123');
    });
  });

  test('navigates to home on successful login', async () => {
    mockUserManager.processLogin.mockResolvedValue(true);
    mockUserManager.loggedIn = true;
    
    render(
      <MemoryRouter initialEntries={['/authenticate/valid-key']}>
        <Routes>
          <Route path="/authenticate/:emailKey" element={<Authenticate userManager={mockUserManager} />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows error message on failed login', async () => {
    mockUserManager.processLogin.mockResolvedValue(false);
    
    render(
      <MemoryRouter initialEntries={['/authenticate/invalid-key']}>
        <Routes>
          <Route path="/authenticate/:emailKey" element={<Authenticate userManager={mockUserManager} />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/error processing this login/i)).toBeInTheDocument();
    });
  });
});
