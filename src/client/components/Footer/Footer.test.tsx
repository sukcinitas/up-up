import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Footer from './Footer';

afterEach(cleanup);

describe('<Footer /> Component', () => {
  it('renders footer component with link to github', () => {
    const { getByText } = render(<Footer />);

    expect(getByText(/^Created by/i).textContent).toBe(
      'Created by sukcinitas',
    );
    const link = getByText(/sukcinitas/i) as HTMLLinkElement;
    expect(link.textContent).toBe('sukcinitas');
    expect(link.href).toBe('https://github.com/sukcinitas');
  });
});
