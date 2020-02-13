import React from 'react';
import { shallow } from 'enzyme';
import Footer from './Footer.jsx';

describe('<Footer />', () => {
  it('renders the component', () => {
    const footer = shallow(<Footer />);
    expect(footer.find('h1').exists()).not.toBe(true);
    expect(footer.find('footer').exists()).toBe(true);
    expect(footer.find('a').exists()).toBe(true);
    expect(footer.find('p').exists()).toBe(true);
    expect(footer.text()).toEqual('Created by sukcinitas');
  });
});
