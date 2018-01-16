import React from 'react';
import { shallow, mount } from 'enzyme';
import { RemoveInvestment } from './remove-investment-button';
import renderer from 'react-test-renderer'
import { Button } from './button'

describe('RemoveInvestment component', () => {
  let component;
  const removeInvestmentMock = jest.fn();

  beforeEach(() => {
    component = shallow(
      <RemoveInvestment
        removeInvestment={removeInvestmentMock}
        holding={{ name: "Some Investment"}}
      />
    );
  });

  it('Should render successfully', () => {
    expect(component.exists()).toEqual(true);
  });

  it('Should call the removeInvestment function when clicked', () => {
      expect(removeInvestmentMock.mock.calls.length).toEqual(0);
      component.find(Button).simulate('click');
      expect(removeInvestmentMock.mock.calls.length).toEqual(1);
    });
});
