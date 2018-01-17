import * as actions from '.'
import { portfolio } from '../data/data'


describe('Actions', () => {
  const holding = portfolio[0]

  it('Should create an action to remove an investment', () => {
    const expectedAction = {
      type: actions.REMOVE_INVESTMENT,
      holding
    }

    expect(actions.removeInvestment(holding)).toEqual(expectedAction)
  })

  it('Should create an action which shows which investment is beeing edited', () => {
    const expectedAction = {
      type: actions.EDITING_INVESTMENT,
      holding
    }

    expect(actions.editInvestment(holding)).toEqual(expectedAction)
  })

  it('Should create an action which updates edited investment', () => {
    const oldHolding = holding
    const updatedHolding = { name: "New Name", y: 1000}
    const expectedAction = {
      type: actions.UPDATE_INVESTMENT,
      oldHolding,
      updatedHolding
    }

    expect(actions.updateInvestment(oldHolding,updatedHolding)).toEqual(expectedAction)
  })

  it('Should create an action which cancels editing investment', ()=>{
    const expectedAction = {
      type: actions.CANCEL_EDITING_INVESTMENT
    }
    expect(actions.cancelEditingInvestment()).toEqual(expectedAction)
  })
})
