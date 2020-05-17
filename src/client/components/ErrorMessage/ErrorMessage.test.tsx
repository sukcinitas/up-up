import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

afterEach(cleanup);

describe('<ErrorMessage /> Component', () => {
  it('renders errorMessage component', () => {
    const { getByText } = render(<ErrorMessage errorMessage="This is an error message!" />);

    expect(getByText(/^This is an error message!/i).textContent).toBe('This is an error message!');
  });
});
