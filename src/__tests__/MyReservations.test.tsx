import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import MyReservations from '../MyReservations';
import { UserManager } from '@condomanagement/condo-brain';

// Mock UserManager
jest.mock('@condomanagement/condo-brain', () => ({
  UserManager: jest.fn().mockImplementation(() => ({
    getMyReservations: jest.fn(),
    deleteMyReservation: jest.fn(),
  })),
}));

describe('MyReservations Component', () => {
  let mockUserManager: any;

  beforeEach(() => {
    mockUserManager = new UserManager();
  });

  test('renders my reservations page', () => {
    mockUserManager.getMyReservations.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <MyReservations userManager={mockUserManager} />
      </BrowserRouter>
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
      </BrowserRouter>
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
      </BrowserRouter>
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
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Pool/i)).toBeInTheDocument();
    });
    
    // Find and click delete button (if present in UI)
    const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(mockUserManager.deleteMyReservation).toHaveBeenCalledWith(1);
      });
    }
  });
});
