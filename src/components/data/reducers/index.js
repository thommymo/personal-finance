import {
  REQUEST_EXCHANGE_RATES,
  RECEIVE_EXCHANGE_RATES,
  SET_PORTFOLIO_SELECTION,
} from '../actions'

function exchangeRates(
  state = {
    isFetching: false,
    items: []
  }, action
) {
  switch(action.type){
    case REQUEST_EXCHANGE_RATES:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_EXCHANGE_RATES:
      return {
        ...state,
        rates: action.rates,
        isFetching: false
      }
    default:
      return state
  }
}

function selection(
  state = {
    holdingsType: false,
    color: false
  }, action
) {
  switch(action.type){
    case SET_PORTFOLIO_SELECTION:
      return {
        ...state,
        holdingsType: action.holdingsType,
        color: action.color
      }
    default:
      return state
  }
}

const reducers = { exchangeRates, selection }

export default reducers
