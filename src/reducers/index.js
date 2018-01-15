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
    isFetching: [],
    items: {},
    receivedAt: 0,
    error: {}
  }, action
) {
  switch(action.type){
    case ERROR_WHILE_FETCHING_MARKET_DATA_FOR_HOLDING:
      var updatedIsFetching = state.isFetching
      var index = state.isFetching.findIndex(element => element.symbol === action.symbol)
      updatedIsFetching[index] = { isFetching: false, symbol: action.symbol }
      return {
        ...state,
        error: {
          error: true,
          errorMessage: {
            [action.symbol]: `Could not load MarketData for ${action.symbol}. This error appeared: ${action.error}`
          }
        },
        isFetching: updatedIsFetching,
      }
    case REQUEST_MARKET_DATA_FOR_HOLDING:
      var updatedIsFetching = state.isFetching
      var index = state.isFetching.findIndex(element => element.symbol === action.symbol)
      if(index!==-1){
        updatedIsFetching[index] = { isFetching: false, symbol: action.symbol }
      }else{
        updatedIsFetching.push({ isFetching: true, symbol: action.symbol })
      }
      return {
        ...state,
        isFetching: updatedIsFetching
      }
    case RECEIVE_MARKET_DATA_FOR_HOLDING:
      var updatedIsFetching = state.isFetching
      var index = state.isFetching.findIndex(element => element.symbol === action.symbol)
      updatedIsFetching[index] = { isFetching: false, symbol: action.symbol }

      let updatedItems = state.items
      updatedItems[action.symbol] = action.json
      updatedItems[action.symbol].receivedAt = action.receivedAt
      return {
        ...state,
        items: updatedItems,
        isFetching: updatedIsFetching,
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

function portfolio(
  state = {
    isFetching: {
      portfolio: false,
      items: {
        count: 0
      },
      currency: false
    },
    items: []
  }, action
) {
  switch(action.type){
    case ADD_INVESTMENT:
      let newItems = state.items
      console.log("action.investment",action.investment);
      newItems.push(action.investment)
      return {
        ...state,
        items: newItems,
      }
    case REQUEST_PORTFOLIO:
      return {
        ...state,
        isFetching: {
          ...state.isFetching,
          portolio: true
        },
      }
    case RECEIVE_PORTFOLIO:
      return {
        ...state,
        isFetching: {
          ...state.isFetching,
          portolio: false,
          items: { count: action.items.length }
        },
        items: action.items,
      }
    default:
      return state
  }
}

const reducers = { exchangeRates, selection, marketDataForHoldings, portfolio }

export default reducers
