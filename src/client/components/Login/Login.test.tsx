import React from 'react';
import {
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';

import Login from './Login';
import { renderComponent } from '../../util/renderComponent';

const preloadedState = { 
  users: {
    userId: '1',
    username: 'testUser1',
    starredPolls: ['1', '2'],
  },
};

afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
describe('<Login /> Component', () => {
  it('renders login component', async () => {
    const { getByText, getAllByText } = renderComponent(<Login />, { preloadedState });

    expect(getByText(/Username/i).textContent).toBe('Username');
    expect(getAllByText(/Login/i));
    expect(getByText(/Register/i).textContent).toBe('Register');
    expect(getByText(/^Do not have an account?/i).textContent).toBe(
      'Do not have an account? Register',
    );
  });

  it('can input all values', () => {
    const { getByLabelText } = renderComponent(<Login />, { preloadedState });

    const usernameInput = getByLabelText(
      'Username',
    ) as HTMLInputElement;
    fireEvent.change(usernameInput, {
      target: { value: 'testUser1' },
    });
    expect(usernameInput.value).toBe('testUser1');

    const passwordInput = getByLabelText(
      'PasswordShow password!',
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, {
      target: { value: 'testPassword' },
    });
    expect(passwordInput.value).toBe('testPassword');
  });

  it('prints error if login unsuccessful', async () => {
    axiosMock.post.mockRejectedValueOnce({
      response: {
        data: { message: 'Username or password is incorrect!' },
      },
    });
    const {
      getByTestId,
      getByText,
      getByLabelText,
    } = renderComponent(<Login />, { preloadedState });

    const usernameInput = getByLabelText(
      'Username',
    ) as HTMLInputElement;
    fireEvent.change(usernameInput, {
      target: { value: 'testUser1' },
    });
    expect(usernameInput.value).toBe('testUser1');

    const passwordInput = getByLabelText(
      'PasswordShow password!',
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, {
      target: { value: 'testPassword' },
    });
    expect(passwordInput.value).toBe('testPassword');

    fireEvent.click(getByTestId('login-btn'));
    const errorMessage = await waitFor(() =>
      getByText('Username or password is incorrect!'),
    );
    expect(errorMessage.textContent).toBe(
      'Username or password is incorrect!',
    );
  });
});

// #handleSuccessful login
