export const REQUEST_EXCHANGE_RATES = 'REQUEST_EXCHANGE_RATES'
export const RECEIVE_EXCHANGE_RATES = 'RECEIVE_EXCHANGE_RATES'
export const REQUEST_MARKET_DATA_FOR_HOLDINGS = 'REQUEST_MARKET_DATA_FOR_HOLDINGS'
export const RECEIVE_MARKET_DATA_FOR_HOLDINGS = 'RECEIVE_MARKET_DATA_FOR_HOLDINGS'
export const ERROR_WHILE_FETCHING_MARKET_DATA_FOR_HOLDINGS = 'ERROR_WHILE_FETCHING_MARKET_DATA_FOR_HOLDINGS'
export const REQUEST_PORTFOLIO = 'REQUEST_PORTFOLIO'
export const RECEIVE_PORTFOLIO = 'RECEIVE_PORTFOLIO'
export const SET_PORTFOLIO_SELECTION = 'SET_PORTFOLIO_SELECTION'

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
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(json => {
        let currencyRates = json.rates
        currencyRates[toCurrency] = 1
        return dispatch(receiveExchangeRates(toCurrency, currencyRates))
      })
  }
}

/*
  FETCH PORTFOLIO
*/

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

export function fetchPortfolio(portfolio, holdingsWithMarketPrice, marketDataForHoldings, exchangeRates) {
  return function (dispatch) {
    dispatch(requestPortfolio())
    const yesterday = ((Date.now())-(60 * 60 * 100 * 24))

    if(exchangeRates.receivedAt < yesterday){
      dispatch(fetchExchangeRates("CHF"))
    }

    dispatch(receivePortfolio(portfolio))
    if(portfolio.length>0){
      const holdingsWithMarketData = portfolio.filter(holding => holdingsWithMarketPrice.some(holdingSymbol => holdingSymbol === holding.type))
      if(marketDataForHoldings.receivedAt < yesterday || checkIfNewHoldingsWithMarketData(holdingsWithMarketData)){
        dispatch(fetchMarketDataForHoldings(holdingsWithMarketData))
      }
    }
    function checkIfNewHoldingsWithMarketData (holdingsWithMarketData) {
      const SymbolsOfHoldingsWithMarketData = holdingsWithMarketData.reduce((acc, holding) => (acc.concat(holding.symbol)),[])
      if(SymbolsOfHoldingsWithMarketData.sort().toString()!== Object.keys(marketDataForHoldings.items).sort().toString()){
        return true
      } else {
        return false
      }
    }
  }
}

/*
  FETCH MARKET DATA FOR HOLDINGS
*/
export function errorWhileFetchingMarketDataForHoldings(symbol, error){
  return {
    type: ERROR_WHILE_FETCHING_MARKET_DATA_FOR_HOLDINGS,
    symbol,
    error
  }
}

export function requestMarketDataForHoldings(symbol) {
  return {
    type: REQUEST_MARKET_DATA_FOR_HOLDINGS,
    symbol
  }
}

export function receiveMarketDataForHoldings(symbol, json) {
  return {
    type: RECEIVE_MARKET_DATA_FOR_HOLDINGS,
    symbol,
    json,
    receivedAt: Date.now()
  }
}

export function fetchMarketDataForHoldings(holdings) {
  return function (dispatch) {

    for(let holding of holdings){
      dispatch(requestMarketDataForHoldings(holding.symbol))
      let url = ""
      if(holding.exchange === "NYSE"){
        url=`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${holding.symbol}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`
      }else{
        url=`http://localhost:4000/isin/${holding.symbol}/${holding.currency}`
      }
      fetch(url, {mode: 'cors'})
        .then(
          response => response.json(),
          error => {
            dispatch(errorWhileFetchingMarketDataForHoldings(holding.symbol, error))
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
          dispatch(receiveMarketDataForHoldings(holding.symbol, json))
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
            "2. high": json.valors[0].data.High[i],//valors.date.High
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

//TODO: ERROR HANDLING
