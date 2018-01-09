import { combineReducers } from 'redux'
import {
  REQUEST_EXCHANGE_RATES,
  RECEIVE_EXCHANGE_RATES,
} from '../actions'

function exchangeRates(
  state = {
    isFetching: false,
    items: []
  }, action
) {
  switch(action.type){
    case REQUEST_EXCHANGE_RATES:
      //Load the Values from API
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_EXCHANGE_RATES:
      //Load the Values from API
      console.log(action)
      return {
        ...state,
        rates: action.rates,
        isFetching: false
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  exchangeRates,
})

export default rootReducer
