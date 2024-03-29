import React from 'react';
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
import formatDate from '../../util/formatDate';
import { AppState } from '../../redux/actions';
import reducer, { initialState } from '../../redux/reducers';

import Poll from './Poll';

function renderWithRedux(
  ui: JSX.Element,
  {
    state = initialState,
    store = createStore(reducer, state),
    route = '/polls/1',
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
// test poll
const poll = {
  _id: '1',
  question: 'Test question',
  name: 'Test one',
  options: [
    { option: 'One', votes: 1 },
    { option: 'Two', votes: 2 },
  ],
  votes: 69,
  createdBy: 'testUser1',
  createdAt: '2020-01-21T12:45:03.180Z',
  updatedAt: '2020-02-14T09:39:26.151Z',
  id: '1',
};

describe('<Poll /> Component', () => {
  it('renders Poll component when default redux state - user not logged in', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { poll, success: true },
    });
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/polls/1">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props: any) => <Poll {...props} />}
      </Route>,
      {
        route: '/polls/1',
      },
    );

    const loader = getByTestId('loader');
    expect(loader.textContent).toBe('');

    const pollQuestion = await waitFor(() =>
      getByText('Test question'),
    );
    expect(pollQuestion.textContent).toBe('Test question');
    const pollName = await waitFor(() => getByText('Test one'));
    expect(pollName.textContent).toBe('Test one');
    const pollVotes = await waitFor(() =>
      getByText('Total votes: 69'),
    );
    expect(pollVotes.textContent).toBe('Total votes: 69');
    const pollCreatedBy = await waitFor(() =>
      getByText('created by testUser1'),
    );
    expect(pollCreatedBy.textContent).toBe('created by testUser1');
    const pollCreatedAt = await waitFor(() =>
      getByText(`created on ${formatDate(poll.createdAt)}`),
    );
    expect(pollCreatedAt.textContent).toBe(
      'created on 2020 m. sausio 21 d.',
    );
  });

  it('renders Poll component when redux state - user logged in', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { poll, success: true },
    });
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/polls/1">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props: any) => <Poll {...props} />}
      </Route>,
      {
        route: '/polls/1',
        state: {
          username: 'testUser1',
          userId: '1',
          starredPolls: ['id'],
        },
      },
    );

    const loader = getByTestId('loader');
    expect(loader.textContent).toBe('');

    const pollQuestion = await waitFor(() =>
      getByText('Test question'),
    );
    expect(pollQuestion.textContent).toBe('Test question');
    const pollName = await waitFor(() => getByText('Test one'));
    expect(pollName.textContent).toBe('Test one');
    const pollVotes = await waitFor(() =>
      getByText('Total votes: 69'),
    );
    expect(pollVotes.textContent).toBe('Total votes: 69');
    const pollCreatedBy = await waitFor(() =>
      getByText('created by testUser1'),
    );
    expect(pollCreatedBy.textContent).toBe('created by testUser1');
    const pollCreatedAt = await waitFor(() =>
      getByText(`created on ${formatDate(poll.createdAt)}`),
    );
    expect(pollCreatedAt.textContent).toBe(
      'created on 2020 m. sausio 21 d.',
    );

    const btn = await waitFor(() => getByText(/delete/i));
    expect(btn.textContent).toBe('Delete');
  });

  it("let's vote and rerenders component after that", async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { poll, success: true },
    });
    axiosMock.put.mockResolvedValueOnce({
      data: {
        poll: {
          ...poll,
          options: [
            { option: 'One', votes: 1 },
            { option: 'Two', votes: 3 },
          ],
          votes: 70,
        },
        success: true,
      },
    });
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/polls/1">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props: any) => <Poll {...props} />}
      </Route>,
      {
        route: '/polls/1',
        state: {
          username: 'testUser1',
          userId: '1',
          starredPolls: ['id'],
        },
      },
    );
    const loader = getByTestId('loader');
    expect(loader.textContent).toBe('');

    const btn = await waitFor(() => getByTestId('Two'));
    fireEvent.click(btn);

    const pollVotes = await waitFor(() =>
      getByText('Total votes: 70'),
    );
    expect(pollVotes.textContent).toBe('Total votes: 70');
  });
});
