import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import { AppState } from '../../../redux/actions';
import reducer, { initialState } from '../../../redux/reducers';
import PollListElem from './PollListElem';

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

describe('<PollListElem /> Component', () => {
  it('renders pollListElem component', () => {
    const poll = {
      id: '1',
      name: 'name',
      votes: 3,
      createdBy: 'panemune',
      updatedAt: '2012-12-12',
    };
    const history = createMemoryHistory();
    const { getByText } = renderWithRedux(
      <Router history={history}>
        <PollListElem
          name={poll.name}
          votes={poll.votes}
          createdBy={poll.createdBy}
          updatedAt={poll.updatedAt}
          id={poll.id}
          starred
          link={(): string => ''}
        />
      </Router>,
      {
        state: {
          userId: '1',
          username: 'testUser1',
          starredPolls: ['id'],
        },
      },
    );
    expect(getByText(/name/i).textContent).toBe('name');
    expect(getByText(/panemune/i).textContent).toBe(' panemune');
    expect(getByText(/last updated on 2012-12-12/i).textContent).toBe(
      'last updated on 2012-12-12',
    );
    expect(getByText(/3/i).textContent).toBe('3');
  });
});
