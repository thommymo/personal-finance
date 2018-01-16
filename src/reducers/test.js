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
  REMOVE_INVESTMENT
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
    Test initial Remove Investment
  */

  describe('Remove Investment', ()=>{
    it('Should return the portfolio state without the investment, which was removed', () => {
      const initialAction = {
        type: ADD_INVESTMENT,
        investment: holding
      }
      //Add one investment:
      const state = reducers.portfolio(undefined, initialAction)
      const action = {
        type: REMOVE_INVESTMENT,
        holding
      }
      //Remove the investment:
      expect(reducers.portfolio(state, action)).toEqual(initialState)
    })
  })
});
