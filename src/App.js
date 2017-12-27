import React, { Component } from 'react'
import idb from 'idb'
import { LineChart, Line } from 'recharts'

class App extends Component {
  constructor(){
    super()
    this.state = {
      shareprice: "loading",
      symbol: "LUKN",
      allData: {}
    }
  }

  componentDidMount(){
    const url=`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=AAPL&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`
    //const url=`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=MSFT&apikey=demo`

    //Get Data from IndexedDB
    //Let's assume for now that the data is never updated (TODO: Do this when data updates)
    idb.open('stock-price-db', 1, (upgradeDB) => {
      //This function is only performed, if there is no indexedDB with the name 'stock-price-db'
      //Here I'll create a key-value-store
      var keyValStore = upgradeDB.createObjectStore('keyval')
      //Here I'll add a value to my key-value-store
      //Notice that .put() takes first the value and then the key
      keyValStore.put(undefined, 'shareprice')
    })
    .then((db) => {
      //get Data from IndexedDB
      var tx = db.transaction('keyval')
      var keyValStore = tx.objectStore('keyval')
      return keyValStore.get('shareprices')
    })
    .then((data) => {
      console.log(data);
      //Check if DB contains data i need
      if(data){
        putDataInState(data)
      }else{
        getDataFromAPI(url)
      }
    })
    .catch(e => console.log(e))

    const putDataInState = (obj) => {
      const mostRecentDateTime = Object.keys(obj["Monthly Adjusted Time Series"])[0]
      const closingPrice = obj["Monthly Adjusted Time Series"][mostRecentDateTime]["5. adjusted close"]
      this.setState({shareprice: closingPrice, allData: obj})
    }

    const getDataFromAPI = (url) => {
      fetch(url, {mode: 'cors'})
      .then((response) => {
        if (!response.ok) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
          return;
        } else {
          return response.json()
        }
      })
      .then(json => {
        //getDataInState(json);
        var dbPromise =  idb.open('stock-price-db', 1, (upgradeDB) => {})
        dbPromise.then( db => {
          var tx = db.transaction('keyval','readwrite')
          var keyValStore = tx.objectStore('keyval')
            keyValStore.put(json, 'shareprices')
        })
        putDataInState(json)
      })
      .catch(e => {console.log(e)})
    }
  }

  render() {
    if (this.state.shareprice !== "loading"){
      var data = Object.keys(this.state.allData["Monthly Adjusted Time Series"]).map(
        (currentValue, index, array) => {
        return { name: currentValue, value: parseInt(this.state.allData["Monthly Adjusted Time Series"][currentValue]["5. adjusted close"]) } } )
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">This is the most recent share price for shares with this symbol: {this.state.symbol}</h1>
        </header>
        <p className="App-intro">
          Currency: CHF
          <span> {this.state.shareprice}</span>
        </p>
        <LineChart width={1400} height={800} data={data}>
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </div>
    )
  }
}

export default App
