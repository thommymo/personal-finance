import {
  REQUEST_EXCHANGE_RATES,
  RECEIVE_EXCHANGE_RATES,
  REQUEST_MARKET_DATA_FOR_HOLDINGS,
  RECEIVE_MARKET_DATA_FOR_HOLDINGS,
  SET_PORTFOLIO_SELECTION,
} from '../actions'

function exchangeRates(
  state = {
    isFetching: false,
    rates: {},
    receivedAt: 0
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
        isFetching: false,
        receivedAt: action.receivedAt
      }
    default:
      return state
  }
}

function marketDataForHoldings(
  state = {
    isFetching: false,
    items: {},
    receivedAt: 0
  }, action
) {
  switch(action.type){
    case REQUEST_MARKET_DATA_FOR_HOLDINGS:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_MARKET_DATA_FOR_HOLDINGS:
      let updatedItems = state.items
      updatedItems[action.holding.symbol] = action.json
      return {
        ...state,
        items: updatedItems,
        isFetching: false,
        receivedAt: action.receivedAt,
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

const reducers = { exchangeRates, selection, marketDataForHoldings }

export default reducers
