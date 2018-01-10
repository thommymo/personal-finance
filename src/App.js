import React, { Component } from 'react'
import PieChartWithData from './components/data/piechart-with-data'
import './utils/global-css'
import { portfolio, holdingsWithMarketPrice } from './data/data'
import { connect } from 'react-redux'
import { fetchExchangeRates, fetchMarketDataForHoldings} from './components/data/actions'



/*
TODO:
1. New Structure (Data and Visual representation should be separated)
2. Clean Coding Principles
3. Everything should be tested
*/

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
    const { dispatch, exchangeRates, marketDataForHoldings} = this.props
    const yesterday = ((Date.now())-(60 * 60 * 100 * 24)) /* 10060 */

    if(exchangeRates.receivedAt < yesterday){
      dispatch(fetchExchangeRates("CHF"))
    }

    const holdingsWithMarketData = portfolio.filter(holding => holdingsWithMarketPrice.some(holdingSymbol => holdingSymbol === holding.type))
    const SymbolsOfHoldingsWithMarketData = holdingsWithMarketData.reduce((acc, holding) => (acc.concat(holding.symbol)),[])

    if(marketDataForHoldings.receivedAt < yesterday || SymbolsOfHoldingsWithMarketData.sort().toString()!== Object.keys(marketDataForHoldings.items).sort().toString()){
      this.props.dispatch(fetchMarketDataForHoldings(holdingsWithMarketData))
    }

  }

  //Get Data from IndexedDB
  //Let's assume for now that the data is never updated (TODO: Do this when data updates)



  render() {
    return (
      <div>
        <PieChartWithData portfolio={portfolio}/>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...state
});

export default connect(mapStateToProps)(App)
