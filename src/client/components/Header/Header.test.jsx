import React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  render, cleanup, fireEvent, waitForElement,
} from '@testing-library/react';
import axiosMock from 'axios';
import 'regenerator-runtime/runtime';
// eslint-disable-next-line no-unused-vars
import reducer, { initialState } from '../../redux/reducers';

import Header from './Header.jsx';

afterEach(cleanup);
jest.mock('axios');

function renderWithRedux(
  ui,
  { // eslint-disable-next-line no-shadow
    initialState,
    store = createStore(reducer, initialState),
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {},

) {
  return {
    ...render(
      <Provider store={store}>
        <Router history={history}>{ui}</Router>
      </Provider>,
    ),
    store,
    history,
  };
}

describe('<Header /> Component', () => {
  it('renders header component when user not loged in', () => {
    const { getByText } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Header {...props} />}
      </Route>,
      {
        route: '/',
      },
    );
    expect(getByText(/Voting App/i).textContent).toBe('Voting App');
    expect(getByText(/Login/i).textContent).toBe('Login');
    expect(getByText(/Register/i).textContent).toBe('Register');
  });

  it('renders header component when user is loged in', () => {
    const user = { username: 'testUser1', userId: '1' };
    const { getByText } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Header {...props} />}
      </Route>,
      {
        route: '/',
        initialState: { ...user },
      },
    );
    expect(getByText(/Voting App/i).textContent).toBe('Voting App');
    expect(getByText(user.username).textContent).toBe('testUser1');
    expect(getByText(/Sign out/i).textContent).toBe('Sign out');
  });

  it('logs user out', async () => {
    const user = { username: 'testUser1', userId: '1' };
    axiosMock.delete.mockResolvedValueOnce({});
    const { getByText } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Header {...props} />}
      </Route>,
      {
        route: '/',
        initialState: { ...user },
      },
    );
    expect(getByText(user.username).textContent).toBe('testUser1');

    fireEvent.click(getByText('Sign out'));

    const loginButton = await waitForElement(() => getByText(/Login/i));
    const registerButton = await waitForElement(() => getByText(/Register/i));
    const votingBanner = await waitForElement(() => getByText(/Voting App/i));
    expect(loginButton.textContent).toBe('Login');
    expect(registerButton.textContent).toBe('Register');
    expect(votingBanner.textContent).toBe('Voting App');
  });
});

// TODO
// #test history push on last test
