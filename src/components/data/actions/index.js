export const REQUEST_EXCHANGE_RATES = 'REQUEST_EXCHANGE_RATES'
export const RECEIVE_EXCHANGE_RATES = 'RECEIVE_EXCHANGE_RATES'
export const SET_PORTFOLIO_SELECTION = 'SET_PORTFOLIO_SELECTION'

export function requestExchangeRates(toCurrency) {
  return {
    type: REQUEST_EXCHANGE_RATES,
    toCurrency
  }
}

export function receiveExchangeRates(toCurrency, json) {
  return {
    type: RECEIVE_EXCHANGE_RATES,
    toCurrency,
    rates: json,
    receivedAt: Date.now()
  }
}

export function setPortfolioSelection(holdingsType,color) {
  return {
    type: SET_PORTFOLIO_SELECTION,
    holdingsType,
    color
  }
}

//TODO: ERROR HANDLING

export function fetchExchangeRates(toCurrency) {
  return function (dispatch) {
    dispatch(requestExchangeRates(toCurrency))
    return fetch(`https://api.fixer.io/latest?base=${toCurrency}`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error))
        .then(json => {
          let currencyRates = json.rates
          currencyRates[toCurrency] = 1
          return dispatch(receiveExchangeRates(toCurrency, currencyRates))
        })
  }
}
