import React from 'react';
import { shallow } from 'enzyme';
import { RemoveInvestment } from './remove-investment';

describe('RemoveInvestment component', () => {
  it('Should render successfully', () => {
    const component = shallow(<RemoveInvestment />);
    expect(component.exists()).toEqual(true);
  });
});
