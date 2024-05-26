import React from 'react';
import {
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';
import Header from './Header';
import { renderComponent } from '../../util/renderComponent';

afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

const preloadedState = { 
  users: {
    userId: '',
    username: '',
    starredPolls: [] as string[],
  },
};

describe('<Header /> Component', () => {
  it('renders header component when user not logged in', () => {
    const { getByText} = renderComponent(<Header />, { preloadedState });
    expect(getByText(/VA/i).textContent).toBe('VA');
    expect(getByText(/Login/i).textContent).toBe('Login');
    expect(getByText(/Register/i).textContent).toBe('Register');
  });

  it('renders header component when user is logged in', () => {
    const preloadedState = { 
      users: {
        userId: '1',
        username: 'testUser1',
        starredPolls: ['1', '2'],
      },
    };
    const { getByText} = renderComponent(<Header />, { preloadedState });
    expect(getByText(/VA/i).textContent).toBe('VA');
    expect(getByText(preloadedState.users.username).textContent).toBe('testUser1');
    expect(getByText(/Sign out/i).textContent).toBe('Sign out');
  });

  it('logs user out', async () => {
    const preloadedState = {
      users: {
        username: 'testUser1',
        userId: '1',
        starredPolls: ['id'],
      },
    };
    axiosMock.get.mockResolvedValueOnce({ data: { success: true } });
    const { getByText} = renderComponent(<Header />, { preloadedState });
    expect(getByText(preloadedState.users.username).textContent).toBe('testUser1');

    fireEvent.click(getByText('Sign out'));

    const loginButton = await waitFor(() => getByText(/Login/i));
    const registerButton = await waitFor(() =>
      getByText(/Register/i),
    );
    const votingBanner = await waitFor(() => getByText(/VA/i));
    expect(loginButton.textContent).toBe('Login');
    expect(registerButton.textContent).toBe('Register');
    expect(votingBanner.textContent).toBe('VA');
  });
});
