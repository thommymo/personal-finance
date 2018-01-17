import React from 'react'
import { shallow } from 'enzyme'
import { SaveInvestmentButton } from './save-investment-button'
import { Button } from './button'
import { portfolio } from '../../data/data'

describe('SaveInvestmentButton component', () => {
  let component
  const saveInvestmentMock = jest.fn()

  beforeEach(() => {
    component = shallow(
      <SaveInvestmentButton
        saveInvestment={saveInvestmentMock}
        oldHolding={portfolio[0]}
        updatedHolding={portfolio[1]} //Just an example
      />
    )
  })

  it('Should render successfully', () => {
    expect(component.exists()).toEqual(true)
  })

  it('Should call the saveInvestment function when clicked', () => {
      expect(saveInvestmentMock.mock.calls.length).toEqual(0)
      component.find(Button).simulate('click')
      expect(saveInvestmentMock.mock.calls.length).toEqual(1)
    });
});
