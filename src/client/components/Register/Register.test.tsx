import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';

import Register from './Register';
import { renderComponent } from '../../util/renderComponent';

afterEach(cleanup);
jest.mock('axios');

const preloadedState = { 
  users: {
    userId: '',
    username: '',
    starredPolls: [] as string[],
  },
};

describe('<Register /> Component', () => {
  it('renders Register component', async () => {
    const { getByText } = renderComponent(<Register />, { preloadedState });


    expect(getByText(/Username/i).textContent).toBe('Username');
    expect(getByText(/^Password$/i).textContent).toBe(
      'PasswordShow password!',
    );
    expect(getByText(/E-mail/i).textContent).toBe('E-mail');
    expect(getByText(/Already have an account?/i).textContent).toBe(
      'Already have an account? Login',
    );
    expect(getByText(/^Login$/i).textContent).toBe('Login');
  });

  it('can input all correct values', () => {
    const { getByLabelText } = renderComponent(<Register />, { preloadedState });
    const username = getByLabelText('Username') as HTMLInputElement;
    const email = getByLabelText('E-mail') as HTMLInputElement;
    const password = getByLabelText(
      'PasswordShow password!',
    ) as HTMLInputElement;

    fireEvent.change(username, { target: { value: 'testUser1' } });
    fireEvent.change(email, {
      target: { value: 'testEmail@test.lt' },
    });
    fireEvent.change(password, { target: { value: 'testas1' } });

    expect(username.value).toBe('testUser1');
    expect(email.value).toBe('testEmail@test.lt');
    expect(password.value).toBe('testas1');
  });

  it('incorrect inputs + prints error if register unsuccessful', async () => {
    const { getByLabelText, getByText } = renderComponent(<Register />, { preloadedState });
    const username = getByLabelText('Username') as HTMLInputElement;
    const email = getByLabelText('E-mail') as HTMLInputElement;
    const password = getByLabelText(
      'PasswordShow password!',
    ) as HTMLInputElement;

    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(email, { target: { value: 'emaiil' } });
    fireEvent.change(password, { target: { value: 'testa' } });

    expect(username.value).toBe('test');
    expect(email.value).toBe('emaiil');
    expect(password.value).toBe('testa');

    expect(
      getByText(
        'Username needs to be between 5 to 30 characters long!',
      ).textContent,
    ).toBe(' Username needs to be between 5 to 30 characters long!');
    expect(getByText('Email needs to be valid!').textContent).toBe(
      ' Email needs to be valid!',
    );
    expect(
      getByText(
        'Your password needs to be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
      ).textContent,
    ).toBe(
      ' Your password needs to be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
    );
  });
});
