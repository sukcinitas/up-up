import React from 'react';
import { render, cleanup } from '@testing-library/react';
import BarChart from './BarChart.jsx';
import drawChart from './helper';

afterEach(cleanup);

describe('<BarChart /> Component', () => {
  it('renders barChart component with svg within', () => {
    const data = { optionsList: [{ option: 'one', votes: 1 }, { option: 'two', votes: 2 }], sumVotes: 3 };

    const { getByText } = render(<BarChart data={data} />);
    drawChart(data);
    expect(getByText(/one/i).textContent).toBe('one');
    expect(getByText(/two/i).textContent).toBe('two');
    expect(getByText(/^1$/i).textContent).toBe('1');
    expect(getByText(/^2$/i).textContent).toBe('2');
    const svg = document.querySelectorAll('svg'); // make sure after re-render old svg is removed
    expect(svg.length).toBe(1);
  });
});
