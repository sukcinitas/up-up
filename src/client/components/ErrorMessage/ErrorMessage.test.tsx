import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

afterEach(cleanup);

describe('<ErrorMessage /> Component', () => {
  it('renders errorMessage component', () => {
    const { getByText } = render(
      <ErrorMessage>This is an error message!</ErrorMessage>,
    );

    expect(getByText(/^This is an error message!/i).textContent).toBe(
      'This is an error message!',
    );
  });
});
