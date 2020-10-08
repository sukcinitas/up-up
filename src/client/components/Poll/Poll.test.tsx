import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import {
  render, cleanup, waitForElement, fireEvent,
} from '@testing-library/react';
// import axiosMock from 'axios';
import axios from 'axios';
import { AppState } from '../../redux/actions';
import reducer, { initialState } from '../../redux/reducers';

import Poll from './Poll';

function renderWithRedux(
  ui:JSX.Element,
  {
    state = initialState,
    store = createStore(reducer, state),
    route = '/polls/1',
    history = createMemoryHistory({ initialEntries: [route] }),
  }:{
    state?:AppState,
    store?:Store,
    route?:string,
    history?:MemoryHistory
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
  options: { one: 1, two: 2 },
  votes: 69,
  createdBy: 'testUser1',
  createdAt: '2020-01-21T12:45:03.180Z',
  updatedAt: '2020-02-14T09:39:26.151Z',
  id: '1',
};

describe('<Poll /> Component', () => {
  it('renders Poll component when default redux state - user not logged in', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { poll, success: true } });
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/polls/1">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props:any) => <Poll {...props} />}
      </Route>,
      {
        route: '/polls/1',
      },
    );

    const loader = getByTestId('loader');
    expect(loader.textContent).toBe('');

    const pollQuestion = await waitForElement(() => getByText('Test question'));
    expect(pollQuestion.textContent).toBe('Test question');
    const pollName = await waitForElement(() => getByText('Test one'));
    expect(pollName.textContent).toBe('Test one');
    const pollVotes = await waitForElement(() => getByText('Total votes: 69'));
    expect(pollVotes.textContent).toBe('Total votes: 69');
    const pollCreatedBy = await waitForElement(() => getByText('created by testUser1'));
    expect(pollCreatedBy.textContent).toBe('created by testUser1');
    const pollCreatedAt = await waitForElement(() => getByText('created on January 21, 2020'));
    expect(pollCreatedAt.textContent).toBe('created on January 21, 2020');
  });

  it('renders Poll component when redux state - user logged in', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { poll, success: true } });
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/polls/1">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props:any) => <Poll {...props} />}
      </Route>,
      {
        route: '/polls/1',
        state: { username: 'testUser1', userId: '1', starredPolls: ['id'] },
      },
    );

    const loader = getByTestId('loader');
    expect(loader.textContent).toBe('');

    const pollQuestion = await waitForElement(() => getByText('Test question'));
    expect(pollQuestion.textContent).toBe('Test question');
    const pollName = await waitForElement(() => getByText('Test one'));
    expect(pollName.textContent).toBe('Test one');
    const pollVotes = await waitForElement(() => getByText('Total votes: 69'));
    expect(pollVotes.textContent).toBe('Total votes: 69');
    const pollCreatedBy = await waitForElement(() => getByText('created by testUser1'));
    expect(pollCreatedBy.textContent).toBe('created by testUser1');
    const pollCreatedAt = await waitForElement(() => getByText('created on January 21, 2020'));
    expect(pollCreatedAt.textContent).toBe('created on January 21, 2020');

    const btn = await waitForElement(() => getByText(/delete/i));
    expect(btn.textContent).toBe('Delete');
  });

  it('let\'s vote and rerenders component after that', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { poll, success: true } });
    axiosMock.put.mockResolvedValueOnce(
      { data: { poll: { ...poll, options: { one: 1, two: 3 }, votes: 70 }, success: true } },
    );
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/polls/1">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props:any) => <Poll {...props} />}
      </Route>,
      {
        route: '/polls/1',
        state: { username: 'testUser1', userId: '1', starredPolls: ['id'] },
      },
    );
    const loader = getByTestId('loader');
    expect(loader.textContent).toBe('');

    const btn = await waitForElement(() => getByTestId('two'));
    fireEvent.click(btn);

    const pollVotes = await waitForElement(() => getByText('Total votes: 70'));
    expect(pollVotes.textContent).toBe('Total votes: 70');
  });
});
