import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders home page with navigation buttons', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    expect(screen.getByText('Resident Login')).toBeInTheDocument();
    expect(screen.getByText('Visitor Parking Registration')).toBeInTheDocument();
  });

  test('navigates to login page when Resident Login is clicked', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    const loginButton = screen.getByText('Resident Login');
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to parking page when Visitor Parking button is clicked', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    const parkingButton = screen.getByText('Visitor Parking Registration');
    fireEvent.click(parkingButton);

    expect(mockNavigate).toHaveBeenCalledWith('/parking');
  });

  test('displays icons for both buttons', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });
});
