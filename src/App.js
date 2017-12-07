import React, { Component } from 'react'

class App extends Component {
  constructor(){
    super()
    this.state = {
      shareprice: "loading",
      symbol: "LUKN"
    }
  }

  componentDidMount(){
    const url=`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.state.symbol}&interval=60min&outputsize=compact&apikey=${process.env.REACT_APP_GRAPHQL_URI}`
    fetch(url, {mode: 'cors'})
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      } else {
        return response.json()
      }
    })
    .then(json => {
      if(json){
        const mostRecentDateTime = Object.keys(json["Time Series (60min)"]).slice(-1)[0]
        const closingPrice = json["Time Series (60min)"][mostRecentDateTime]["4. close"]
        this.setState({shareprice: closingPrice})
      }
    })
    .catch(e => {console.log(e)})
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">This is the most recent share price for shares with this symbol: {this.state.symbol}</h1>
        </header>
        <p className="App-intro">
          Currency: CHF
          <span> {this.state.shareprice}</span>
        </p>
      </div>
    )
  }
}

export default App
