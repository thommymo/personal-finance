import React from 'react'
import { shallow } from 'enzyme'
import { CancelEditingInvestmentButton } from './cancel-editing-investment-button'
import { Button } from './button'
import { portfolio } from '../../data/data'

describe('CancelEditingInvestmentButton component', () => {
  let component
  const cancelEditingInvestmentMock = jest.fn()

  beforeEach(() => {
    component = shallow(
      <CancelEditingInvestmentButton
        cancelEditingInvestment={cancelEditingInvestmentMock}
        holding={portfolio[0]}
      />
    )
  })

  it('Should render successfully', () => {
    expect(component.exists()).toEqual(true)
  })

  it('Should call the cancelEditingInvestment function when clicked', () => {
      expect(cancelEditingInvestmentMock.mock.calls.length).toEqual(0)
      component.find(Button).simulate('click')
      expect(cancelEditingInvestmentMock.mock.calls.length).toEqual(1)
    });
});
