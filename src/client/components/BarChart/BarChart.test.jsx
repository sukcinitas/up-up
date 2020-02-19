import React from 'react';
import { render, cleanup } from '@testing-library/react';
import BarChart from './BarChart.jsx';
import drawChart from './helper';

afterEach(cleanup);

describe('<BarChart /> Component', () => {
  it('renders barChart component with svg', () => {
    const data = { optionsList: [{ option: 'one', votes: 1 }, { option: 'two', votes: 2 }], sumVotes: 3 };

    const { getByText } = render(<BarChart data={data} />);
    drawChart(data);
    expect(getByText(/one/i).textContent).toBe('one');
    expect(getByText(/two/i).textContent).toBe('two');
    expect(getByText(/^1$/i).textContent).toBe('1');
    expect(getByText(/^2$/i).textContent).toBe('2');
  });
});
