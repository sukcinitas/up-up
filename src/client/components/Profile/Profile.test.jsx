import React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup, waitForElement } from '@testing-library/react';
import axiosMock from 'axios';
import 'regenerator-runtime/runtime';
// eslint-disable-next-line no-unused-vars
import reducer, { initialState } from '../../redux/reducers';

import Profile from './Profile.jsx';

function renderWithRedux(
  ui,
  { // eslint-disable-next-line no-shadow
    initialState,
    store = createStore(reducer, initialState),
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
const user = {
  _id: '5e3d7310317be85301cdc3a8',
  username: 'panemune',
  email: 'panemune@panemu.lt',
};

describe('<Profile /> Component', () => {
  it('renders Profile component', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { user: [user] } });
    const { getByText } = renderWithRedux(
      <Route path="/user/profile/testUser1">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Profile {...props} />}
      </Route>,
      {
        route: '/user/profile/testUser1',
        initialState: { userId: '1', username: 'testUser1' },
      },
    );
    expect(getByText('Loading...').textContent).toBe('Loading...');

    const heading = await waitForElement(() => getByText(/User information/i));
    expect(heading.textContent).toBe('User information');
    const username = await waitForElement(() => getByText(/Username/i));
    expect(username.textContent).toBe('Username:testUser1');
    const deleteAccount = await waitForElement(() => getByText(/Delete account/i));
    expect(deleteAccount.textContent).toBe('Delete account');
    const createAPoll = await waitForElement(() => getByText(/Create a poll/i));
    expect(createAPoll.textContent).toBe('Create a poll');
  });
});
