export const REQUEST_EXCHANGE_RATES = 'REQUEST_EXCHANGE_RATES'
export const RECEIVE_EXCHANGE_RATES = 'RECEIVE_EXCHANGE_RATES'
export const REQUEST_MARKET_DATA_FOR_HOLDINGS = 'REQUEST_MARKET_DATA_FOR_HOLDINGS'
export const RECEIVE_MARKET_DATA_FOR_HOLDINGS = 'RECEIVE_MARKET_DATA_FOR_HOLDINGS'
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
  FETCH MARKET DATA FOR HOLDINGS
*/


export function requestMarketDataForHoldings(holdings) {
  return {
    type: REQUEST_MARKET_DATA_FOR_HOLDINGS,
    holdings
  }
}

export function receiveMarketDataForHoldings(holding, json) {
  return {
    type: RECEIVE_MARKET_DATA_FOR_HOLDINGS,
    holding,
    json,
    receivedAt: Date.now()
  }
}

export function fetchMarketDataForHoldings(holdings) {
  return function (dispatch) {
    dispatch(requestMarketDataForHoldings(holdings))
    return new Promise (
      (resolve, reject) => {
        for(let holding of holdings){

          let url = ""
          if(holding.exchange === "NYSE"){
            url=`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${holding.symbol}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`
          }else{
            url=`http://localhost:4000/isin/${holding.symbol}/${holding.currency}`
          }
          fetch(url, {mode: 'cors'})
            .then(
              response => response.json(),
              error => console.log('An error occurred.', error)
            ).then(json => {
              if(holding.exchange==="SWX"){
                //Data Structure of data from SWX is diffrent from the one from
                //Alphavantage (NYSE etc.) - this is the reason for this function
                json = convertSWXData(json)
              }
              dispatch(receiveMarketDataForHoldings(holding, json))
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
    )
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
