import * as React from 'react';
import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  wait,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import axios from 'axios';
import UserPolls from './UserPolls';

afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
describe('<UserPolls /> Component', () => {
  it('renders userPolls component', async () => {
    const polls = [
      { id: '1', votes: 1, name: 'test-name-one' },
      { id: '2', votes: 2, name: 'test-name-two' },
    ];
    axiosMock.get.mockResolvedValueOnce({
      data: { polls, success: true },
    });

    const history = createMemoryHistory();
    const { getByText, getByTestId } = render(
      <Router history={history}>
        <UserPolls username="testUser1" />
      </Router>,
    );
    const loader = getByTestId('loader');
    expect(loader.textContent).toBe('');
    // render after time to get has passed
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    const resolvedPollNameOne = await waitForElement(() =>
      getByText(/test-name-one/i),
    );
    const resolvedPollNameTwo = await waitForElement(() =>
      getByText(/test-name-two/i),
    );
    const resolvedPollVotesOne = await waitForElement(() =>
      getByText(/1 vote/i),
    );
    const resolvedPollVotesTwo = await waitForElement(() =>
      getByText(/2 votes/i),
    );
    expect(resolvedPollNameOne.textContent).toBe('test-name-one');
    expect(resolvedPollNameTwo.textContent).toBe('test-name-two');
    expect(resolvedPollVotesOne.textContent).toBe('1 vote');
    expect(resolvedPollVotesTwo.textContent).toBe('2 votes');
  });

  it('deletes poll and rerenders component', async () => {
    const polls = [
      { id: '1', votes: 1, name: 'test-name-one' },
      { id: '2', votes: 2, name: 'test-name-two' },
    ];
    // first it renders all two polls, deletes one and then re-renders only one
    axiosMock.get.mockResolvedValueOnce({
      data: { polls, success: true },
    });
    axiosMock.delete.mockResolvedValueOnce({
      data: { success: true },
    });
    axiosMock.get.mockResolvedValueOnce({
      data: { polls: [polls[1]], success: true },
    });

    const history = createMemoryHistory();
    const { getByText, getByTestId, queryByText } = render(
      <Router history={history}>
        <UserPolls username="testUser1" />
      </Router>,
    );

    const resolvedPollNameOne = await waitForElement(() =>
      getByText(/test-name-one/i),
    );
    expect(resolvedPollNameOne.textContent).toBe('test-name-one');
    const resolvedPollVotesOne = await waitForElement(() =>
      getByText(/1 vote/i),
    );
    expect(resolvedPollVotesOne.textContent).toBe('1 vote');

    const btn = await waitForElement(() => getByTestId('1'));
    fireEvent.click(btn);

    expect(axiosMock.delete).toHaveBeenCalledTimes(1);
    await wait(() =>
      expect(queryByText(/test-name-one/i)).toBeFalsy(),
    );
    await wait(() => expect(queryByText(/1 vote/i)).toBeFalsy());
    const resolvedPollNameTwo = await waitForElement(() =>
      getByText(/test-name-two/i),
    );
    const resolvedPollVotesTwo = await waitForElement(() =>
      getByText(/2 votes/i),
    );
    expect(resolvedPollNameTwo.textContent).toBe('test-name-two');
    expect(resolvedPollVotesTwo.textContent).toBe('2 votes');
  });
});
