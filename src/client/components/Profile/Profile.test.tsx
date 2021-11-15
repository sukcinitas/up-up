import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import {
  render,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import axios from 'axios';
import { AppState } from '../../redux/actions';
import reducer, { initialState } from '../../redux/reducers';
import Profile from './Profile';

function renderWithRedux(
  ui: JSX.Element,
  {
    state = initialState,
    store = createStore(reducer, state),
    route = '/user/profile/testUser1',
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
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/user/profile/testUser1">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props: any) => <Profile {...props} />}
      </Route>,
      {
        route: '/user/profile/testUser1',
        state: {
          userId: '1',
          username: 'testUser1',
          starredPolls: ['id'],
        },
      },
    );
    expect(getByTestId('info').textContent).toBe('User information');
    expect(getByTestId('user').textContent).toBe('Username: testUser1');
    expect(getByText(/Delete account/i).textContent).toBe('Delete account');

    fireEvent.click(getByText(/Delete account/i));
    expect(getByText(/Confirm/i).textContent).toBe('Confirm');

    fireEvent.click(getByText(/Confirm/i));
    const message = await waitFor(() =>
      getByText(/User has been successfully deleted!/i),
    );
    expect(message.textContent).toBe('User has been successfully deleted!');
  });
});
