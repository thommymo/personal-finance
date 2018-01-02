import React, { Component } from 'react'
import idb from 'idb'
import LineChartWithData from './linechartwithdata'
import styled from 'styled-components'

const portfolio =  {
  JNK: {
    count: 100,
  },
  SMI: {
    count: 100,
  },
  AAPL: {
    count: 50
  }
}

class App extends Component {
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
    //foreach Symbol, get Data and put it into client side storage
    var symbols = ['JNK','AAPL','MSFT','XAU','SMI']
    this.getData(symbols).then(data => {
      for(let share of Object.keys(data)){

        data[share].then(data => {
          console.log((data))
          let newData = this.state.allData
          newData[share] = data
          let symbols = this.state.symbols
          symbols.push(share)
          console.log(symbols);
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

    const getDataFromAPI = (symbol) => {
      const url=`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`

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
        dbPromise.then( db => {
          var tx = db.transaction('keyval','readwrite')
          var keyValStore = tx.objectStore('keyval')
            //Here I'll add a value to my key-value-store
            //Notice that .put() takes first the value and then the key
            keyValStore.put(json, json["Meta Data"]["2. Symbol"])
        })
        console.log(json["Monthly Adjusted Time Series"]);
        return json["Monthly Adjusted Time Series"]
      })
      .catch(e => {console.log(e)})
    }

    return new Promise (
      (resolve, reject) => {
        var allData = { }
        for(let symbol of symbols){
          allData[symbol] = idb.open('stock-price-db', 1, (upgradeDB) => {
            //This function is only performed, if there is no indexedDB with the name 'stock-price-db'
            //Here I'll create a key-value-store
            var keyValStore = upgradeDB.createObjectStore('keyval')
            //keyValStore.put(undefined, 'shareprices')
          })
          .then((db) => {
            //get Data from IndexedDB
            var tx = db.transaction('keyval')
            var keyValStore = tx.objectStore('keyval')
            return keyValStore.get(symbol)
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
      <div>
        <header>
          <h1>This is the most recent share price for shares with this symbol: {this.state.symbol}</h1>
        </header>
        <p>
          Currency: CHF
          <span> {this.state.shareprice}</span>
        </p>
        <LineChartWithData loadingStatus={this.state.shareprice} data={this.state.allData} symbols={this.state.symbols}/>
      </div>
    )
  }
}

export default App
