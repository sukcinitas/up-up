import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import PollListElem from './PollListElem.jsx';

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
    const { getByText } = render(
      <Router history={history}>
        <PollListElem
          name={poll.name}
          votes={poll.votes}
          createdBy={poll.createdBy}
          updatedAt={poll.updatedAt}
          id={poll.id}
        />
      </Router>,
    );
    expect(getByText(/name/i).textContent).toBe('name');
    expect(getByText(/panemune/i).textContent).toBe(' panemune');
    expect(getByText(/updated on 2012-12-12/i).textContent).toBe('updated on 2012-12-12');
    expect(getByText(/3/i).textContent).toBe('3');
  });
});
