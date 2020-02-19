import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import axiosMock from 'axios';
import UserPolls from './UserPolls.jsx';
import 'regenerator-runtime/runtime'; // for async

afterEach(cleanup);
jest.mock('axios');

describe('<UserPolls /> Component', () => {
  it('renders userPolls component', async () => {
    const polls = [{ id: '1', votes: 1, name: 'test-name-one' }, { id: '2', votes: 2, name: 'test-name-two' }];
    axiosMock.get.mockResolvedValueOnce({ data: { polls } });

    const { getByText } = render(<UserPolls username="test" />);
    // first render
    expect(getByText(/^You have not created any polls yet!/i).textContent).toBe('You have not created any polls yet!');
    // render after time to get
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    const resolvedPollNameOne = await waitForElement(() => getByText(/test-name-one/i));
    const resolvedPollNameTwo = await waitForElement(() => getByText(/test-name-two/i));
    const resolvedPollVotesOne = await waitForElement(() => getByText(/1 vote/i));
    const resolvedPollVotesTwo = await waitForElement(() => getByText(/2 votes/i));
    expect(resolvedPollNameOne.textContent).toBe('test-name-one');
    expect(resolvedPollNameTwo.textContent).toBe('test-name-two');
    expect(resolvedPollVotesOne.textContent).toBe('1 vote');
    expect(resolvedPollVotesTwo.textContent).toBe('2 votes');
  });
});
