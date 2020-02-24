import React from 'react';
import {
  render, cleanup, fireEvent, waitForElement,
} from '@testing-library/react';
import 'regenerator-runtime/runtime';
import axiosMock from 'axios';
// eslint-disable-next-line no-unused-vars

import ProfileEmail from './ProfileEmail.jsx';

afterEach(cleanup);
jest.mock('axios');

describe('<ProfileEmail /> Component', () => {
  it('renders ProfileEmail component', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }] } });
    axiosMock.put.mockResolvedValueOnce({ data: { message: 'Your email has been successfully updated!' } });
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'pa@pa.lt' }] } });
    const { getByText, getByTestId } = render(
      <ProfileEmail
        userId="1"
        username="testUser1"
      />,
    );
    expect(getByText(/Email:Loading.../i).textContent).toBe('Email:Loading...');
    expect(getByText(/^Change email$/i).textContent).toBe('Change email');

    const resolvedEmail = await waitForElement(() => getByText(/^Email/));
    expect(resolvedEmail.textContent).toBe('Email:test@test.lt');

    fireEvent.click(getByText(/^Change email$/i));
    const changebtn = await waitForElement(() => getByText(/^Change$/));
    expect(changebtn.textContent).toBe('Change');

    const input = await waitForElement(() => getByTestId('newEmail'));
    fireEvent.change(input, { target: { value: 'pa@pa.lt' } });
    expect(input.value).toBe('pa@pa.lt');

    fireEvent.click(changebtn);
    const message = await waitForElement(() => getByText('Your email has been successfully updated!'));
    expect(message.textContent).toBe('Your email has been successfully updated!');
    expect(resolvedEmail.textContent).toBe('Email:pa@pa.lt');
  });

  it('shows message when email update unsuccessful', async () => {
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }] } });
    axiosMock.put.mockResolvedValueOnce({ data: { message: 'Email is already in use!' } });
    axiosMock.get.mockResolvedValueOnce({ data: { user: [{ username: 'testUser1', email: 'test@test.lt' }] } });
    const { getByText, getByTestId } = render(
      <ProfileEmail
        userId="1"
        username="testUser1"
      />,
    );
    expect(getByText(/Email:Loading.../i).textContent).toBe('Email:Loading...');
    expect(getByText(/^Change email$/i).textContent).toBe('Change email');

    const resolvedEmail = await waitForElement(() => getByText(/^Email/));
    expect(resolvedEmail.textContent).toBe('Email:test@test.lt');

    fireEvent.click(getByText(/^Change email$/i));
    const changebtn = await waitForElement(() => getByText(/^Change$/));
    expect(changebtn.textContent).toBe('Change');

    const input = await waitForElement(() => getByTestId('newEmail'));
    fireEvent.change(input, { target: { value: 'test@test.lt' } });
    expect(input.value).toBe('test@test.lt');

    fireEvent.click(changebtn);
    const message = await waitForElement(() => getByText('Email is already in use!'));
    expect(message.textContent).toBe('Email is already in use!');
    expect(resolvedEmail.textContent).toBe('Email:test@test.lt');
  });
});
