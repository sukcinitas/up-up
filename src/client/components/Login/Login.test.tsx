import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import {
  render,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';
import reducer, { initialState, AppState } from '../../store/reducers/usersSlice';

import Login from './Login';
import { configureStore } from '@reduxjs/toolkit';

function renderWithRedux(
  ui: JSX.Element,
  {
    state = initialState,
    store = configureStore({ reducer, preloadedState: state }),
    route = '/user/login',
    history = createMemoryHistory({ initialEntries: [route] }),
  }: {
    state?: AppState;
    store?: Store;
    route?: string;
    history?: MemoryHistory;
  } = {},
) {
  return {
    ...render(
      <Provider store={store}>
        <Router>
          <Routes>
            {ui}
          </Routes>
        </Router>
      </Provider>,
    ),
    store,
    history,
  };
}
afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
describe('<Login /> Component', () => {
  it('renders login component', async () => {
    const { getByText, getAllByText } = renderWithRedux(
      <Route path="/user/login">
        <Login />
      </Route>,
      {
        route: '/user/login',
      },
    );

    expect(getByText(/Username/i).textContent).toBe('Username');
    expect(getAllByText(/Login/i));
    expect(getByText(/Register/i).textContent).toBe('Register');
    expect(getByText(/^Do not have an account?/i).textContent).toBe(
      'Do not have an account? Register',
    );
  });

  it('can input all values', () => {
    const { getByLabelText } = renderWithRedux(
      <Route path="/user/login">
        <Login />
      </Route>,
      {
        route: '/user/login',
      },
    );

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
    } = renderWithRedux(
      <Route path="/user/login">
        <Login />
      </Route>,
      {
        route: '/user/login',
      },
    );

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
