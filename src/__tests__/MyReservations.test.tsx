import '@testing-library/jest-dom';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MyReservations from '../MyReservations';

// Mock UserManager
jest.mock('@condomanagement/condo-brain', () => ({
  UserManager: jest.fn().mockImplementation(() => ({
    getMyReservations: jest.fn(),
    deleteMyReservation: jest.fn(),
  })),
}));

// Temporarily skipped due to es-cookie ESM module issue
// TODO: Fix es-cookie transformation or replace with alternative
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('MyReservations Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUserManager: any;

  beforeEach(() => {
    mockUserManager = {
      getMyReservations: jest.fn().mockResolvedValue([]),
      deleteMyReservation: jest.fn().mockResolvedValue(true),
      checkLogin: jest.fn(),
      getUser: jest.fn(),
      userType: 'Owner',
    };
  });

  test('renders my reservations page', () => {
    render(
      <BrowserRouter>
        <MyReservations userManager={mockUserManager} />
      </BrowserRouter>,
    );

    expect(screen.getByText('My Reservations')).toBeInTheDocument();
  });

  test('loads and displays reservations on mount', async () => {
    const mockReservations = [
      {
        id: 1,
        amenity: 'Pool',
        startTime: new Date('2025-01-15T10:00:00'),
        endTime: new Date('2025-01-15T12:00:00'),
      },
      {
        id: 2,
        amenity: 'Gym',
        startTime: new Date('2025-01-16T14:00:00'),
        endTime: new Date('2025-01-16T15:00:00'),
      },
    ];

    mockUserManager.getMyReservations.mockResolvedValue(mockReservations);

    render(
      <BrowserRouter>
        <MyReservations userManager={mockUserManager} />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockUserManager.getMyReservations).toHaveBeenCalled();
    });

    expect(screen.getByText(/Pool/i)).toBeInTheDocument();
    expect(screen.getByText(/Gym/i)).toBeInTheDocument();
  });

  test('shows empty state when no reservations exist', async () => {
    mockUserManager.getMyReservations.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <MyReservations userManager={mockUserManager} />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockUserManager.getMyReservations).toHaveBeenCalled();
    });
  });

  test('handles reservation deletion', async () => {
    const mockReservations = [
      {
        id: 1,
        amenity: 'Pool',
        startTime: new Date('2025-01-15T10:00:00'),
        endTime: new Date('2025-01-15T12:00:00'),
      },
    ];

    mockUserManager.getMyReservations.mockResolvedValue(mockReservations);
    mockUserManager.deleteMyReservation.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <MyReservations userManager={mockUserManager} />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Pool/i)).toBeInTheDocument();
    });

    // Find and click delete button (if present in UI)
    const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });
    expect(deleteButtons.length).toBeGreaterThan(0);

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockUserManager.deleteMyReservation).toHaveBeenCalledWith(1);
    });
  });
});
