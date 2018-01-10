import React, { Component } from 'react'
import idb from 'idb'
import LineChart from '../molecules/linechart'
import PieChartWithData from '../../components/data/piechart-with-data'
import '../../utils/global-css'
import { portfolio, holdingsWithMarketPrice } from '../../data/data'
import { connect } from 'react-redux'
import { fetchExchangeRates } from '../../components/data/actions'



/*
TODO:
1. New Structure (Data and Visual representation should be separated)
2. Clean Coding Principles
3. Everything should be tested
*/

class LineChartWithData extends Component {
  constructor(){
    super()
    this.state = {
      shareprice: "loading",
      symbol: "JNK",
      allData: {},
      symbols: []
    }
  }

  componentDidMount(){
    var portfolio=this.props.symbols
    console.log(portfolio);

    //foreach holding with market data, get Data and put it into client side storage
    var symbols = portfolio.filter(holding => holdingsWithMarketPrice.some(holdingSymbol => holdingSymbol === holding.type))

    this.getData(symbols).then(data => {
      for(let share of Object.keys(data)){
        data[share].then(data => {
          let newData = this.state.allData
          newData[share] = data
          let symbols = this.state.symbols
          symbols.push(share)
          this.setState({shareprice: "loaded", allData: newData, symbols: symbols})
          }
        )
      }
      //TODO: Exception handling
    })
  }

  //Get Data from IndexedDB
  //Let's assume for now that the data is never updated (TODO: Do this when data updates)

  getData = (symbols) => {
    const convertSWXData = (json) => {
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

    const getDataFromAPI = (symbol) => {
      var url = ""
      if(symbol.exchange === "NYSE"){
        url=`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol.symbol}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`
      }else{
        url=`http://localhost:4000/isin/${symbol.symbol}/${symbol.currency}`
      }
        return fetch(url, {mode: 'cors'})
        .then((response) => {
          if (!response.ok) {
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
          } else {
            return response.json()
          }
        })
        .then(json => {
          var dbPromise =  idb.open('stock-price-db', 1, (upgradeDB) => {})
          if(symbol.exchange==="SWX"){
            //Data Structure of data from SWX is diffrent from the one from
            //Alphavantage (NYSE etc.) - this is the reason for this function
            json = convertSWXData(json)
          }
          dbPromise.then( db => {
            var tx = db.transaction('keyval','readwrite')
            var keyValStore = tx.objectStore('keyval')
              //Here I'll add a value to my key-value-store
              //Notice that .put() takes first the value and then the key
              keyValStore.put(json, json["Meta Data"]["2. Symbol"])
          })
          return json["Monthly Adjusted Time Series"]
        })
        .catch(e => {console.log(e)})
      }

    return new Promise (
      (resolve, reject) => {
        var allData = { }
        for(let symbol of symbols){
          allData[symbol.symbol] = idb.open('stock-price-db', 1, (upgradeDB) => {
            //This function is only performed, if there is no indexedDB with the name 'stock-price-db'
            //Here I'll create a key-value-store
            upgradeDB.createObjectStore('keyval')
            //keyValStore.put(undefined, 'shareprices')
          })
          .then((db) => {
            //get Data from IndexedDB
            var tx = db.transaction('keyval')
            var keyValStore = tx.objectStore('keyval')
            return keyValStore.get(symbol.symbol)
          })
          .then((data) => {
            //Check if DB contains data i need
            if(data){
              //returns data
              return data["Monthly Adjusted Time Series"]
            }else{
              //returns promise to deliver data
              return getDataFromAPI(symbol)
            }
          })
          .catch(e => console.log(e))
        }
        resolve(allData)
      }
    )
  }

  render() {
    return (
        <LineChart loadingStatus={this.state.shareprice} data={this.state.allData} symbols={this.state.symbols}/>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...state
});

export default connect(mapStateToProps)(LineChartWithData)
