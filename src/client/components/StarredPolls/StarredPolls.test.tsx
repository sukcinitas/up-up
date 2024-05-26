import React from 'react';
import {
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';
import StarredPolls from './StarredPolls';
import { renderComponent } from '../../util/renderComponent';

const preloadedState = { 
  users: {
    userId: '1',
    username: 'testUser1',
    starredPolls: ['1', '2'],
  },
};

afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

describe('<StarredPolls /> Component', () => {
  it('renders StarredPolls component', async () => {
    const polls = [
      { _id: '1', votes: 1, name: 'test-name-one' },
      { _id: '2', votes: 2, name: 'test-name-two' },
    ];
    axiosMock.post.mockResolvedValueOnce({
      data: { polls, success: true },
    });
    const { getByText, getByTestId } = renderComponent(<StarredPolls />, { preloadedState });
    // first render
    const loader = getByTestId('loader');
    expect(loader.textContent).toBe('');
    // render after time to get has passed
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    const resolvedPollNameOne = await waitFor(() =>
      getByText(/test-name-one/i),
    );
    const resolvedPollNameTwo = await waitFor(() =>
      getByText(/test-name-two/i),
    );
    expect(resolvedPollNameOne.textContent).toBe('test-name-one');
    expect(resolvedPollNameTwo.textContent).toBe('test-name-two');
  });

  it('deletes poll and rerenders component', async () => {
    const polls = [
      { _id: '1', votes: 1, name: 'test-name-one' },
      { _id: '2', votes: 2, name: 'test-name-two' },
    ];
    const polls2 = [{ _id: '2', votes: 2, name: 'test-name-two' }];
    // first it renders all two polls, deletes one and then re-renders only one
    axiosMock.post.mockResolvedValueOnce({
      data: { polls, success: true },
    });
    axiosMock.put.mockResolvedValueOnce({ data: { success: true } });
    axiosMock.get.mockResolvedValueOnce({
      data: { user: [{ starredPolls: ['2'] }] },
    });
    axiosMock.post.mockResolvedValueOnce({
      data: { polls: polls2, success: true },
    });

    const { getByText, getByTestId, queryByText } = renderComponent(<StarredPolls />, { preloadedState });

    const resolvedPollNameOne = await waitFor(() =>
      getByText(/test-name-one/i),
    );
    expect(resolvedPollNameOne.textContent).toBe('test-name-one');

    const btn = await waitFor(() => getByTestId('1'));
    fireEvent.click(btn);

    expect(axiosMock.put).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(queryByText(/test-name-one/i)).toBeFalsy(),
    );
    await waitFor(() => expect(queryByText(/1 vote/i)).toBeFalsy());
    const resolvedPollNameTwo = await waitFor(() =>
      getByText(/test-name-two/i),
    );
    expect(resolvedPollNameTwo.textContent).toBe('test-name-two');
  });
});
