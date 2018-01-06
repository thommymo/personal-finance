import React, { Component } from 'react'
import idb from 'idb'
import LineChartWithData from './linechartwithdata'
import {PieChart, Pie, LabelList, Label} from 'recharts'

const portfolio =  [
  { name: "JNK", value: 20, description: "US Junk Bonds", type: "bond" },
  { name: "AAPL", value: 20, description: "Apple Shares", type: "share" },
  { name: "MSFT", value: 20, description: "Microsoft Shares", type: "share" },
  { name: "XAU", value: 20, description: "Junk Bonds", type: "share" },
  { name: "SMI", value: 20, description: "Junk Bonds", type: "share" },
  { name: "Postfinance", value: 137, description: "Cash", type: "cash", denomination: "CHF" },
  { name: "True Wealth", value: 41, description: "Cash", type: "cash", denomination: "GBP"  },
  { name: "True Wealth", value: 404, description: "Cash", type: "cash", denomination: "USD"  },
  { name: "True Wealth", value: 86, description: "Cash", type: "cash", denomination: "EUR"  },
  { name: "FTAL:LN", value: 17, description: "SPDR® FTSE UK All Share UCITS ETF", type: "cash", denomination: "GBP"  },
  { name: "EXSA:TH", value: 17, description: "SPDR® FTSE UK All Share UCITS ETF", type: "cash", denomination: "GBP"  },
  { name: "ABL", value: 20, description: "Cash", type: "private loan", denomination: "CHF"  },
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
    var symbols = [
      {exchange: "NYSE", symbol: 'JNK', name:"US Junk Bonds"},
      {exchange: "NYSE", symbol: 'VTI', name:"Vanguard US Total Stock Market Shares Index ETF"},
      {exchange: "NYSE", symbol: 'VWO', name:"Vanguard FTSE Emerging Markets ETF"},
      {exchange: "NYSE", symbol: 'VPL', name:"Vanguard FTSE Pacific ETF"},
      {exchange: "SWX", symbol: 'IE00B7452L46', name:"SPDR® FTSE UK All Share UCITS ETF"},
      {exchange: "SWX", symbol: 'CH0017142719', name:"UBS ETF (CH) - SMI (CHF)"},
      {exchange: "SWX", symbol: 'CH0139101593', name:"ZKB Gold ETF A (CHF)"}
    ]
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
        url=`http://localhost:4000/isin/${symbol.symbol}`
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
            //NSYE - this is the reason for this function
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
              console.log("datafromAPI", data)
              return data["Monthly Adjusted Time Series"]
            }else{
              //returns promise to deliver data
              console.log(symbol.symbol,data)
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
