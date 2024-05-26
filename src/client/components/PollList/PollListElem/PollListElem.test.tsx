import React from 'react';
import { cleanup } from '@testing-library/react';
import PollListElem from './PollListElem';
import { renderComponent } from '../../../util/renderComponent';

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

    const preloadedState = { 
      users: {
        userId: '1',
        username: 'testUser1',
        starredPolls: ['id'] as string[],
      },
    };
    
    const { getByText } = renderComponent(
      <PollListElem
        name={poll.name}
        votes={poll.votes}
        createdBy={poll.createdBy}
        updatedAt={poll.updatedAt}
        id={poll.id}
        starred
        link={(): string => ''}
      />,
      { preloadedState },
    );
    expect(getByText(/name/i).textContent).toBe('name');
    expect(getByText(/panemune/i).textContent).toBe(' panemune');
    expect(getByText(/last updated on 2012-12-12/i).textContent).toBe(
      'last updated on 2012-12-12',
    );
    expect(getByText(/3/i).textContent).toBe('3');
  });
});
