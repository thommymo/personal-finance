import { currency } from '../data/data'

export const REQUEST_EXCHANGE_RATES = 'REQUEST_EXCHANGE_RATES'
export const RECEIVE_EXCHANGE_RATES = 'RECEIVE_EXCHANGE_RATES'
export const REQUEST_MARKET_DATA_FOR_HOLDING = 'REQUEST_MARKET_DATA_FOR_HOLDING'
export const RECEIVE_MARKET_DATA_FOR_HOLDING = 'RECEIVE_MARKET_DATA_FOR_HOLDING'
export const ERROR_WHILE_FETCHING_MARKET_DATA_FOR_HOLDING = 'ERROR_WHILE_FETCHING_MARKET_DATA_FOR_HOLDINGS'
export const REQUEST_PORTFOLIO = 'REQUEST_PORTFOLIO'
export const RECEIVE_PORTFOLIO = 'RECEIVE_PORTFOLIO'
export const SET_PORTFOLIO_SELECTION = 'SET_PORTFOLIO_SELECTION'
export const ADD_INVESTMENT_TO_PORTFOLIO = 'ADD_INVESTMENT_TO_PORTFOLIO'
export const REMOVE_INVESTMENT_FROM_PORTFOLIO = 'REMOVE_INVESTMENT_FROM_PORTFOLIO'
export const EDITING_INVESTMENT = 'EDITING_INVESTMENT'
export const UPDATE_INVESTMENT_IN_PORTFOLIO = 'UPDATE_INVESTMENT_IN_PORTFOLIO'
export const CANCEL_EDITING_INVESTMENT = 'CANCEL_EDITING_INVESTMENT'

/*
  FETCH EXCHANGE RATES
*/

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

export function fetchExchangeRates(toCurrency) {
  return function (dispatch) {
    dispatch(requestExchangeRates(toCurrency))

    return fetch(`https://api.fixer.io/latest?base=${toCurrency}`)
      .then(
        response => {rates: currency},
        error => {
          //TODO: Fetch data from my own API, where I should have cached currency data
          console.log('An error occurred.', error, currency)
          //if there is an error, get data from stale data
          return {rates: currency}
        }
      )
      .then(json => {
        let currencyRates = json.rates
        currencyRates[toCurrency] = 1
        return dispatch(receiveExchangeRates(toCurrency, currencyRates))
      })
  }
}

/*
  PORTFOLIO
*/

export function addHolding(holding){
  return function(dispatch){
    dispatch(addHoldingToPortfolio(holding))
    if(holding.symbol){
      dispatch(fetchMarketDataForHolding(holding))
    }
  }
}


export function addHoldingToPortfolio(investment = {}){
  return {
    type: ADD_INVESTMENT_TO_PORTFOLIO,
    investment
  }
}

export function updateInvestment(oldHolding, updatedHolding){
  return {
    type: UPDATE_INVESTMENT_IN_PORTFOLIO,
    oldHolding,
    updatedHolding
  }
}

export function editInvestment(holding){
  return {
    type: EDITING_INVESTMENT,
    holding
  }
}

export function cancelEditingInvestment(){
  return{
    type: CANCEL_EDITING_INVESTMENT
  }
}

export function removeInvestment(holding){
  return {
    type: REMOVE_INVESTMENT_FROM_PORTFOLIO,
    holding
  }
}

export function requestPortfolio() {
  return {
    type: REQUEST_PORTFOLIO,
  }
}

export function receivePortfolio(items) {
  return {
    type: RECEIVE_PORTFOLIO,
    items
  }
}




/* fetchPortfolio gets initial state, when no values are available yet */

export function fetchPortfolio(portfolio, holdingsWithMarketPrice, marketDataForHoldings, exchangeRates) {

  return function (dispatch) {
    const yesterday = ((Date.now())-(60 * 60 * 100 * 24))

    dispatch(requestPortfolio())

    if(exchangeRates.receivedAt < yesterday){
      dispatch(fetchExchangeRates("CHF"))
    }

    //TODO: Portfolio should be loaded from DB

    dispatch(receivePortfolio(portfolio))

    if(portfolio.length>0){
      const holdingsWithMarketData = portfolio.filter(holding => holdingsWithMarketPrice.some(holdingSymbol => holdingSymbol === holding.type))
      holdingsWithMarketData.forEach((holding) => {
        if(isNotYetFetchedHolding(holding, marketDataForHoldings)){
          dispatch(fetchMarketDataForHolding(holding))
        } else {
          if(isOldData(marketDataForHoldings, holding, yesterday))
            dispatch(fetchMarketDataForHolding(holding))
          }
        }
      )
    }

    function isOldData (marketDataForHoldings, holding, date){
      if(Object.keys(marketDataForHoldings.items[holding.symbol]).length > 0){
        return marketDataForHoldings.items[holding.symbol].receivedAt < date
      } else {
        return true
      }
    }

    function isNotYetFetchedHolding (holding, marketDataForHoldings) {
      const SymbolsOfHoldingsWithMarketData = Object.keys(marketDataForHoldings.items)
      return !SymbolsOfHoldingsWithMarketData.includes(holding.symbol)
    }
  }
}

/*
  FETCH MARKET DATA FOR HOLDINGS
*/
export function errorWhileFetchingMarketDataForHolding(symbol, error){
  return {
    type: ERROR_WHILE_FETCHING_MARKET_DATA_FOR_HOLDING,
    symbol,
    error
  }
}

export function requestMarketDataForHolding(symbol) {
  return {
    type: REQUEST_MARKET_DATA_FOR_HOLDING,
    symbol
  }
}

export function receiveMarketDataForHolding(symbol, json) {
  return {
    type: RECEIVE_MARKET_DATA_FOR_HOLDING,
    symbol,
    json,
    receivedAt: Date.now()
  }
}

export function fetchMarketDataForHolding(holding) {
  return function (dispatch) {

    dispatch(requestMarketDataForHolding(holding.symbol))

    let url = ""

    if(holding.exchange === "NYSE"){
      url=`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${holding.symbol}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`
    }else if (holding.exchange === "SWX"){
      url=`http://localhost:4000/isin/${holding.symbol}/${holding.currency}`
    } else {
      dispatch(errorWhileFetchingMarketDataForHolding(holding.symbol, `Could not find Market ${holding.exchange}`))
      return
    }

    fetch(url, {mode: 'cors'})
      .then(
        response => response.json(),
        error => {
          dispatch(errorWhileFetchingMarketDataForHolding(holding.symbol, error))
          console.log('An error occurred.', error)
        }

        /*
         TODO:
         1. We need to notify the user about the error (DONE)
         2. We need to retry to fetch new data for this url after a certain time
         3. After reloading we need to refetch data for urls with errors (error message will be cached now and data will not be refetched)
         */

      ).then(json => {
        if(holding.exchange==="SWX"){
          //Data Structure of data from SWX is diffrent from the one from
          //Alphavantage (NYSE etc.) - this is the reason for this function
          json = convertSWXData(json)
        }
        dispatch(receiveMarketDataForHolding(holding.symbol, json))
      })
  }

  function convertSWXData(json) {
    var object = {
      "Meta Data": {
        "1. Information": "Monthly Adjusted Prices and Volumes",
        "2. Symbol": json.valors[0].ISIN, //json.valors.ISIN
        "3. Last Refreshed": Date.now(), //delayedDateTime
        "4. Time Zone": "CET/Zurich" //CH/Zurich
      },
      "Monthly Adjusted Time Series": {
        // "2000-02-29": {  //valors.date.Date (20040924)
          // "1. open": "104.0000", //valors.date.Open
          // "2. high": "119.9400",//valors.date.High
          // "3. low": "97.0000", //valors.date.Low
          // "4. close": "114.6200",  //valors.date.Close
          // "5. adjusted close": "3.6693", //valors.date.Close
          // "6. volume": "65355200", //valors.date.TotalVolume
          // "7. dividend amount": "0.0000"
      }
    }

    let value = {}
    const dates = json.valors[0].data.Date
    for(let i=0; i<dates.length; i++){
      let date = String(dates[i])
      let nextdate = String(dates[(i+1)])
      if(date.substring(4,6)!==nextdate.substring(4,6)){
        date = date.substring(0,4) + "-" + date.substring(4,6) + "-" + date.substring(6,8)
        value[date] = {
          "1. open": json.valors[0].data.Open[i], //valors.date.Open
          "2. high": json.valors[0].data.High[i], //valors.date.High
          "3. low": json.valors[0].data.Low[i], //valors.date.Low
          "4. close": json.valors[0].data.Close[i],  //valors.date.Close
          "5. adjusted close": json.valors[0].data.Close[i], //valors.date.Close
          "6. volume": json.valors[0].data.TotalVolume[i] //valors.date.TotalVolume
        }
      }
    }
    object["Monthly Adjusted Time Series"] = value
    return object
  }

}

/*
    SET STATES WHICH ARE GLOBALLY USED
*/

export function setPortfolioSelection(holdingsType,color) {
  return {
    type: SET_PORTFOLIO_SELECTION,
    holdingsType,
    color
  }
}
