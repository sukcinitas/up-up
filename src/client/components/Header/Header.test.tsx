import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  render, cleanup, fireEvent, waitForElement,
} from '@testing-library/react';
import axios from 'axios';
import 'regenerator-runtime/runtime';
import reducer, { initialState } from '../../redux/reducers';

import Header from './Header';

afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

function renderWithRedux(
  ui,
  {
    state = initialState,
    store = createStore(reducer, state),
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
  it('renders header component when user not logged in', () => {
    const { getByText } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Header {...props} />}
      </Route>,
      {
        route: '/',
      },
    );
    expect(getByText(/V\./i).textContent).toBe('V.');
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
        state: { ...user },
      },
    );
    expect(getByText(/V\./i).textContent).toBe('V.');
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
        state: { ...user },
      },
    );
    expect(getByText(user.username).textContent).toBe('testUser1');

    fireEvent.click(getByText('Sign out'));

    const loginButton = await waitForElement(() => getByText(/Login/i));
    const registerButton = await waitForElement(() => getByText(/Register/i));
    const votingBanner = await waitForElement(() => getByText(/V\./i));
    expect(loginButton.textContent).toBe('Login');
    expect(registerButton.textContent).toBe('Register');
    expect(votingBanner.textContent).toBe('V.');
  });
});

// TODO
// #test history push on last test
