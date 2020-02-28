import * as React from 'react';
import {
  render, cleanup, fireEvent, waitForElement,
} from '@testing-library/react';
import 'regenerator-runtime/runtime';
// import axiosMock from 'axios';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars

import ProfilePassword from './ProfilePassword.jsx';

afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

describe('<ProfilePassword /> Component', () => {
  it('renders ProfilePassword component', async () => {
    axiosMock.put.mockResolvedValueOnce({ data: { message: 'Password is incorrect!' } });
    axiosMock.put.mockResolvedValueOnce({ data: { message: 'Your password has been successfully updated!' } });
    const { getByText, getByTestId } = render(
      <ProfilePassword
        userId="1"
        username="testUser1"
      />,
    );
    fireEvent.click(getByText(/^Change password$/i));
    expect(getByText(/^Change$/).textContent).toBe('Change');

    const oldPassword = getByTestId('oldPassword') as HTMLInputElement;
    fireEvent.change(oldPassword, { target: { value: 'incorrectOldPassword' } });
    expect(oldPassword.value).toBe('incorrectOldPassword');

    const newPassword = getByTestId('newPassword') as HTMLInputElement;
    fireEvent.change(newPassword, { target: { value: 'newPass' } });
    expect(newPassword.value).toBe('newPass');

    fireEvent.click(getByText(/^Change$/));
    const message = await waitForElement(() => getByText('Password is incorrect!'));
    expect(message.textContent).toBe('Password is incorrect!');

    fireEvent.change(oldPassword, { target: { value: 'correctOldPassword' } });
    expect(oldPassword.value).toBe('correctOldPassword');

    fireEvent.click(getByText(/^Change$/));
    const message2 = await waitForElement(() => getByText('Your password has been successfully updated!'));
    expect(message2.textContent).toBe('Your password has been successfully updated!');
  });
});
