import React, { Component } from 'react'
import idb from 'idb'
import LineChartWithData from './linechartwithdata'
import styled from 'styled-components'
import {PieChart, Pie, Tooltip, LabelList, Legend, Label} from 'recharts'

const portfolio =  [
  { name: "JNK", value: 20, description: "US Junk Bonds", type: "bond" },
  { name: "AAPL", value: 20, description: "Apple Shares", type: "share" },
  { name: "MSFT", value: 20, description: "Microsoft Shares", type: "share" },
  { name: "XAU", value: 20, description: "Junk Bonds", type: "share" },
  { name: "SMI", value: 20, description: "Junk Bonds", type: "share" },
]

const types = portfolio.reduce((accumulator, value) => {
 if(accumulator.some((element) => (element.type === value.type))){
   let sum = accumulator.filter((element) => (element.type === value.type))[0]
   sum.value = sum.value + value.value
   return  accumulator.filter((element) => (element.type !== value.type)).concat(sum)
 } else {
   return  accumulator.concat({ name: value.type+"s", value: value.value, description: value.type+"s", type: value.type})
 }
},
[])

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
          <h1>This is your Portfolio</h1>
        </header>
        <h2>
          Your Portfolio
        </h2>
        <PieChart width={730} height={250}>
          <Pie data={types} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" label>
            <Label value="Pages of my website" offset={0} position="insideBottom" />
            <LabelList dataKey="value" position="insideBottom" />
          </Pie>
          <Pie data={portfolio} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={90} outerRadius={120} fill="#82ca9d">
            <Label value="Pages of my website" offset={0} position="insideBottom" />
            <LabelList dataKey="name" position="top" />
          </Pie>
        </PieChart>
        <h2>
          Your Performance
        </h2>
        <LineChartWithData loadingStatus={this.state.shareprice} data={this.state.allData} symbols={this.state.symbols}/>
      </div>
    )
  }
}

export default App
