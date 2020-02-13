import React from 'react';
import { shallow } from 'enzyme';
import BarChart from './BarChart.jsx';


describe('<BarChart />', () => {
  it('renders the component', () => {
    const data = {
      optionsList: [{ option: 'one', votes: 1 }, { option: 'two', votes: 2 }],
      votes: 3,
    };
    const barChart = shallow(<BarChart data={data} />);
    expect(barChart.find('#chart').exists()).toBe(true);
  });
});
