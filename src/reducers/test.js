/* global expect, it, describe */

import reducers from '.';
import { portfolio } from '../data/data'
import {
  REQUEST_EXCHANGE_RATES,
  RECEIVE_EXCHANGE_RATES,
  REQUEST_MARKET_DATA_FOR_HOLDING,
  RECEIVE_MARKET_DATA_FOR_HOLDING,
  SET_PORTFOLIO_SELECTION,
  REQUEST_PORTFOLIO,
  RECEIVE_PORTFOLIO,
  ERROR_WHILE_FETCHING_MARKET_DATA_FOR_HOLDING,
  ADD_INVESTMENT,
  REMOVE_INVESTMENT,
  EDITING_INVESTMENT,
  UPDATE_INVESTMENT,
  CANCEL_EDITING_INVESTMENT
} from '../actions'

describe('Portfolio Reducer', () => {
  //TODO: Move into constants somewhere
  const initialState = {
    isFetching: {
      portfolio: false,
      items: {
        count: 0
      },
      currency: false
    },
    items: []
  }
  const holding = portfolio[0]

  /*
    Test initial state
  */

  it('Should return the initial state when no action passed', () => {
    expect(reducers.portfolio(undefined, {})).toEqual(initialState);
  });

  /*
    Bring portfolio in a state where it contains initial data
  */

  const initialAction = {
    type: RECEIVE_PORTFOLIO,
    items: portfolio.map(item => Object.assign({},item))
  }

  const state = reducers.portfolio({}, initialAction)

  /*
    Test initial Remove Investment
  */


  describe('Remove Investment', ()=>{
    it('Should return the portfolio state without the investment, which was removed', () => {
      const holding = { name: "Added investement", y:201}
      // add investement which will be removed later
      const addInvestmentAction = {
        type: ADD_INVESTMENT,
        investment: holding
      }
      const stateWithAddedInvestement = reducers.portfolio(state, addInvestmentAction)
      const action = {
        type: REMOVE_INVESTMENT,
        holding
      }
      //Remove the investment:
      expect(reducers.portfolio(stateWithAddedInvestement, action)).toEqual(state)
    })
  })

  describe('Editing Investment', () => {
    it('Should return the portfolio state with the one investment beeing in the editing state', () => {
      //edit an element
      const index = 3
      const holding1 = Object.assign( {}, portfolio[index] )
      const holding2 = Object.assign( {}, portfolio[index+1] )
      const updatedHolding1 = { ...holding1, editing: true}

      let action = {
        type: EDITING_INVESTMENT,
        holding: holding1
      }

      expect(reducers.portfolio(state, action).items[index]).toEqual(updatedHolding1)

      //edit a second element
      action = {
        type: EDITING_INVESTMENT,
        holding: holding2
      }
      //Only one element should be in editing mode now
      expect(reducers.portfolio(state, action).items.filter(item=>(item.editing === true)).length).toEqual(1)

    })
  })

  describe('Update Investment', () => {
    it('Should return the portfolio state with the updated investment', () => {
      //edit an element
      const index = 3
      let updatedPortfolio = portfolio.map(item => Object.assign({},item))
      const updatedHolding = updatedPortfolio[index]
      updatedHolding.name = "New Name"
      updatedHolding.y = 100
      updatedHolding.currency = "USD"

      const action = {
        type: UPDATE_INVESTMENT,
        oldHolding: portfolio[index],
        updatedHolding: updatedHolding
      }

      expect(reducers.portfolio(state, action).items).toEqual(updatedPortfolio)

    })
  })

  describe('Cancel Editing Investment', () => {
    it('Should return the portfolio without any editing values', () => {
      const action = {
        type: CANCEL_EDITING_INVESTMENT
      }

      state.items[3].editing = true

      expect(reducers.portfolio(state, action).items).toEqual(portfolio)
    })
  })
});
