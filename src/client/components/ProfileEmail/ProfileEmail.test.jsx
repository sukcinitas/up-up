import React from 'react';
import {
  render, cleanup, fireEvent,
} from '@testing-library/react';
import 'regenerator-runtime/runtime';
// eslint-disable-next-line no-unused-vars

import ProfileEmail from './ProfileEmail.jsx';

afterEach(cleanup);
jest.mock('axios');

describe('<ProfileEmail /> Component', () => {
  it('renders ProfileEmail component', async () => {
    const { getByText } = render(
      <ProfileEmail
        email="testUser1@test.lt"
        message=""
        isChangingEmail={false}
        changeEmail={jest.fn}
        showEmailChange={jest.fn}
      />,
    );
    expect(getByText(/Email:testUser1@test.lt/i).textContent).toBe('Email:testUser1@test.lt');
  });

  it('renders ProfileEmail component with change panel and message', async () => {
    const { getByText } = render(
      <ProfileEmail
        email="testUser1@test.lt"
        message="Email was updated successfully!"
        isChangingEmail
        changeEmail={jest.fn}
        showEmailChange={jest.fn}
      />,
    );
    expect(getByText(/Email:testUser1@test.lt/i).textContent).toBe('Email:testUser1@test.lt');
    expect(getByText(/^Change$/i).textContent).toBe('Change');
    expect(getByText(/^Email was updated successfully!$/i).textContent).toBe('Email was updated successfully!');
  });

  it('renders ProfileEmail component with change panel where you can input value of new email', async () => {
    const { getByText, getByTestId } = render(
      <ProfileEmail
        email="testUser1@test.lt"
        message=""
        isChangingEmail
        changeEmail={jest.fn}
        showEmailChange={jest.fn}
      />,
    );
    expect(getByText(/Email:testUser1@test.lt/i).textContent).toBe('Email:testUser1@test.lt');
    expect(getByText(/^Change$/i).textContent).toBe('Change');
    const input = getByTestId('newEmail');
    fireEvent.change(input, { target: { value: 'pa@pa.lt' } });
    expect(input.value).toBe('pa@pa.lt');
  });
});
