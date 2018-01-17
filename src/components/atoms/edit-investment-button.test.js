import React from 'react'
import { shallow } from 'enzyme'
import { EditInvestmentButton } from './edit-investment-button'
import { Button } from './button'
import { portfolio } from '../../data/data'

describe('EditInvestmentButton component', () => {
  let component
  const editInvestmentMock = jest.fn()

  beforeEach(() => {
    component = shallow(
      <EditInvestmentButton
        editInvestment={editInvestmentMock}
        holding={portfolio[0]}
      />
    )
  })

  it('Should render successfully', () => {
    expect(component.exists()).toEqual(true)
  })

  it('Should call the editInvestment function when clicked', () => {
      expect(editInvestmentMock.mock.calls.length).toEqual(0)
      component.find(Button).simulate('click')
      expect(editInvestmentMock.mock.calls.length).toEqual(1)
    });
});
