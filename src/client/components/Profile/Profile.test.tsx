import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  render, cleanup, waitForElement, fireEvent,
} from '@testing-library/react';
// import axiosMock from 'axios';
import axios from 'axios';
import reducer, { initialState } from '../../redux/reducers';
import Profile from './Profile';

function renderWithRedux(
  ui,
  {
    state = initialState,
    store = createStore(reducer, state),
    route = '/user/profile/testUser1',
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
afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

describe('<Profile /> Component', () => {
  it('renders Profile component', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }] } });
    axiosMock.delete.mockResolvedValueOnce({ data: {} });
    const { getByText } = renderWithRedux(
      <Route path="/user/profile/testUser1">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Profile {...props} />}
      </Route>,
      {
        route: '/user/profile/testUser1',
        state: { userId: '1', username: 'testUser1' },
      },
    );
    expect(getByText(/User information/i).textContent).toBe('User information');
    expect(getByText(/Username/i).textContent).toBe('Username:testUser1');
    expect(getByText(/Delete account/i).textContent).toBe('Delete account');
    expect(getByText(/Create a poll/i).textContent).toBe('Create a poll');
    expect(getByText(/^Polls$/i).textContent).toBe('Polls');

    fireEvent.click(getByText(/Delete account/i));
    const message = await waitForElement(() => getByText(/User has been successfully deleted!/i));
    expect(message.textContent).toBe('User has been successfully deleted!');
  });
});

// #history.push
