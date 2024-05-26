import React from 'react';
import {
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import axios from 'axios';
import Profile from './Profile';
import { renderComponent } from '../../util/renderComponent';

afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

describe('<Profile /> Component', () => {
  it('renders Profile component', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: {
        user: [{ username: 'testUser1', email: 'test@test.lt' }],
        success: true,
      },
    });
    axiosMock.delete.mockResolvedValueOnce({
      data: { success: true },
    });

    const preloadedState = { 
      users: {
        userId: '1',
        username: 'testUser1',
        starredPolls: ['id'] as string[],
      },
    };
    

    const { getByText, getByTestId } = renderComponent(<Profile />, { preloadedState });
    expect(getByTestId('info').textContent).toBe('User information');
    expect(getByTestId('user').textContent).toBe(
      'Username: testUser1',
    );
    expect(getByText(/Delete account/i).textContent).toBe(
      'Delete account',
    );

    fireEvent.click(getByText(/Delete account/i));
    expect(getByText(/Confirm/i).textContent).toBe('Confirm');

    fireEvent.click(getByText(/Confirm/i));
    const message = await waitFor(() =>
      getByText(/User has been successfully deleted!/i),
    );
    expect(message.textContent).toBe(
      'User has been successfully deleted!',
    );
  });
});
