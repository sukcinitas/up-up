import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
} from '@testing-library/react';
import axios from 'axios';
import { AppState } from '../../redux/actions';
import reducer, { initialState } from '../../redux/reducers';

import Header from './Header';

afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

function renderWithRedux(
  ui: JSX.Element,
  {
    state = initialState,
    store = createStore(reducer, state),
    route = '/',
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
        {(props: any) => <Header {...props} />}
      </Route>,
      {
        route: '/',
      },
    );
    expect(getByText(/VA\./i).textContent).toBe('VA.');
    expect(getByText(/Login/i).textContent).toBe('Login');
    expect(getByText(/Register/i).textContent).toBe('Register');
  });

  it('renders header component when user is logged in', () => {
    const user = {
      username: 'testUser1',
      userId: '1',
      starredPolls: ['id'],
    };
    const { getByText } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props: any) => <Header {...props} />}
      </Route>,
      {
        route: '/',
        state: { ...user },
      },
    );
    expect(getByText(/VA\./i).textContent).toBe('VA.');
    expect(getByText(user.username).textContent).toBe('testUser1');
    expect(getByText(/Sign out/i).textContent).toBe('Sign out');
  });

  it('logs user out', async () => {
    const user = {
      username: 'testUser1',
      userId: '1',
      starredPolls: ['id'],
    };
    axiosMock.get.mockResolvedValueOnce({ data: { success: true } });
    const { getByText } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props: any) => <Header {...props} />}
      </Route>,
      {
        route: '/',
        state: { ...user },
      },
    );
    expect(getByText(user.username).textContent).toBe('testUser1');

    fireEvent.click(getByText('Sign out'));

    const loginButton = await waitForElement(() =>
      getByText(/Login/i),
    );
    const registerButton = await waitForElement(() =>
      getByText(/Register/i),
    );
    const votingBanner = await waitForElement(() =>
      getByText(/VA\./i),
    );
    expect(loginButton.textContent).toBe('Login');
    expect(registerButton.textContent).toBe('Register');
    expect(votingBanner.textContent).toBe('VA.');
  });
});
