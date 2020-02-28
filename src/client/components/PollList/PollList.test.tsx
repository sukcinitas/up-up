import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup, waitForElement } from '@testing-library/react';
// import axiosMock from 'axios';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import reducer, { initialState, AppState } from '../../redux/reducers';

import PollList from './PollList.js';

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
afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
// test polls
const polls = [{
  _id: '5e26f24f04f39d26e3cde70e',
  name: 'Test one',
  votes: 69,
  createdBy: 'testUser1',
  createdAt: '2020-01-21T12:45:03.180Z',
  updatedAt: '2020-02-14T09:39:26.151Z',
  id: '5e26f24f04f39d26e3cde70e',
},
{
  _id: '5e31b8061907f3051baafd34',
  name: 'Test two',
  votes: 18,
  createdBy: 'testUser2',
  createdAt: '2020-01-29T16:51:18.874Z',
  updatedAt: '2020-02-12T16:49:15.871Z',
  id: '5e31b8061907f3051baafd34',
}];

describe('<PollList /> Component', () => {
  it('renders PollList component when default redux state - user not loged in', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { polls } });
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <PollList {...props} />}
      </Route>,
      {
        route: '/',
      },
    );
    expect(getByText('Loading...').textContent).toBe('Loading...');

    const pollsDiv = await waitForElement(() => getByTestId('test-polls-list'));
    expect(pollsDiv.className).toBe('poll-list');
    const pollNameOne = await waitForElement(() => getByText('Test one'));
    expect(pollNameOne.textContent).toBe('Test one');
    const pollNameTwo = await waitForElement(() => getByText('Test two'));
    expect(pollNameTwo.textContent).toBe('Test two');
  });

  it('renders PollList component when redux state - user loged in', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { polls } });
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <PollList {...props} />}
      </Route>,
      {
        route: '/',
        initialState: { username: 'testUser1', userId: '1' },
      },
    );
    expect(getByText('Loading...').textContent).toBe('Loading...');

    const pollsDiv = await waitForElement(() => getByTestId('test-polls-list'));
    expect(pollsDiv.className).toBe('poll-list');
    const pollNameOne = await waitForElement(() => getByText('Test one'));
    expect(pollNameOne.textContent).toBe('Test one');
    const pollNameTwo = await waitForElement(() => getByText('Test two'));
    expect(pollNameTwo.textContent).toBe('Test two');

    const createPoll = await waitForElement(() => getByText('Create a poll'));
    expect(createPoll.textContent).toBe('Create a poll');
  });
});
