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
})
