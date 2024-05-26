import React from 'react';
import {
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';
import ProfilePassword from './ProfilePassword';
import { renderComponent } from '../../util/renderComponent';

afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

const preloadedState = { 
  users: {
    userId: '1',
    username: 'testUser1',
    starredPolls: [] as string[],
  },
};

describe('<ProfilePassword /> Component', () => {
  it('renders ProfilePassword component', async () => {
    axiosMock.put.mockResolvedValueOnce({
      data: { success: false, message: 'Password is incorrect!' },
    });
    axiosMock.put.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Your password has been successfully updated!',
      },
    });
    const { getByText, getByTestId } = renderComponent(
      <ProfilePassword userId="1" username="testUser1" />, { preloadedState }
    );
    fireEvent.click(getByText(/^Change password$/i));
    expect(getByText(/^Change$/).textContent).toBe('Change');

    const oldPassword = getByTestId(
      'oldPassword',
    ) as HTMLInputElement;
    fireEvent.change(oldPassword, {
      target: { value: 'incorrectOldPassword' },
    });
    expect(oldPassword.value).toBe('incorrectOldPassword');

    const newPassword = getByTestId(
      'newPassword',
    ) as HTMLInputElement;
    fireEvent.change(newPassword, {
      target: { value: 'newPass123@' },
    });
    expect(newPassword.value).toBe('newPass123@');

    fireEvent.click(getByText(/^Change$/));
    const message = await waitFor(() =>
      getByText('Password is incorrect!'),
    );
    expect(message.textContent).toBe('Password is incorrect!');

    fireEvent.change(oldPassword, {
      target: { value: 'correctOldPassword' },
    });
    expect(oldPassword.value).toBe('correctOldPassword');
    fireEvent.change(newPassword, {
      target: { value: 'newPass123@' },
    });
    expect(newPassword.value).toBe('newPass123@');

    fireEvent.click(getByText(/^Change$/));
    const message2 = await waitFor(() =>
      getByText('Your password has been successfully updated!'),
    );
    expect(message2.textContent).toBe(
      'Your password has been successfully updated!',
    );
  });
});
