import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { createStore, applyMiddleware, Store } from 'redux';
import { Provider } from 'react-redux';
import {
  render, cleanup, waitForElement, fireEvent,
} from '@testing-library/react';
import axios from 'axios';
import thunk from 'redux-thunk';
import { AppState } from '../../redux/actions';
import reducer, { initialState } from '../../redux/reducers';

import PollList from './PollList';

function renderWithRedux(
  ui:JSX.Element,
  {
    state = initialState,
    store = createStore(reducer, state, applyMiddleware(thunk)),
    route = '/',
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
  it('renders PollList component when default redux state - user not logged in', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { polls, success: true } });
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props:any) => <PollList {...props} />}
      </Route>,
      {
        route: '/',
      },
    );
    const loader = getByTestId('loader');
    expect(loader.textContent).toBe('');

    const pollsDiv = await waitForElement(() => getByTestId('test-polls-list'));
    // firsty I sort by newest, last child is the least recently created one
    // expect(pollsDiv.lastChild.firstChild.textContent)
    // .toBe('Test onecreated by testUser169 voteslast updated on February 14, 2020');
    expect(pollsDiv.className).toBe('poll-list');
    const pollNameOne = await waitForElement(() => getByText('Test one'));
    expect(pollNameOne.textContent).toBe('Test one');
    const pollNameTwo = await waitForElement(() => getByText('Test two'));
    expect(pollNameTwo.textContent).toBe('Test two');

    fireEvent.click(getByText(/^most popular$/)); // I sort by most popular
    expect(pollsDiv.lastChild.firstChild.textContent).toBe('Test twocreated by testUser218 voteslast updated on February 12, 2020');
  });

  it('renders PollList component when redux state - user logged in', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { polls, success: true } });
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ starredPolls: [] }], success: true } });
    const { getByText, getByTestId } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props:any) => <PollList {...props} />}
      </Route>,
      {
        route: '/',
        state: { username: 'testUser1', userId: '1', starredPolls: ['5e31b8061907f3051baafd34', '5e26f24f04f39d26e3cde70e'] },
      },
    );
    const loader = getByTestId('loader');
    expect(loader.textContent).toBe('');

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
