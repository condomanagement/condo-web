import '@testing-library/jest-dom';
import { UserManager } from '@condomanagement/condo-brain';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Authenticate from '../Authenticate';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      </MemoryRouter>,
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockUserManager.processLogin).toHaveBeenCalledWith('test-email-key-123');
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('navigates to home on successful login', async () => {
    mockUserManager.processLogin.mockResolvedValue(true);
    mockUserManager.loggedIn = true;

    // Mock window.location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.location = { href: '' } as any;

    render(
      <MemoryRouter initialEntries={['/authenticate/valid-key']}>
        <Routes>
          <Route path="/authenticate/:emailKey" element={<Authenticate userManager={mockUserManager} />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(window.location.href).toBe('/');
    });
  });

  test('shows error message on failed login', async () => {
    mockUserManager.processLogin.mockResolvedValue(false);

    render(
      <MemoryRouter initialEntries={['/authenticate/invalid-key']}>
        <Routes>
          <Route path="/authenticate/:emailKey" element={<Authenticate userManager={mockUserManager} />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/error processing this login/i)).toBeInTheDocument();
    });
  });
});
