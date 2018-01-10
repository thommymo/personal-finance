import React, { Component } from 'react'
import PieChartWithData from './components/data/piechart-with-data'
import './utils/global-css'
import { portfolio, holdingsWithMarketPrice } from './data/data'
import { connect } from 'react-redux'
import { fetchExchangeRates, fetchMarketDataForHoldings} from './actions'

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
    const yesterday = ((Date.now())-(60 * 60 * 100 * 24))

    if(exchangeRates.receivedAt < yesterday){
      dispatch(fetchExchangeRates("CHF"))
    }

    const holdingsWithMarketData = portfolio.filter(holding => holdingsWithMarketPrice.some(holdingSymbol => holdingSymbol === holding.type))
    const SymbolsOfHoldingsWithMarketData = holdingsWithMarketData.reduce((acc, holding) => (acc.concat(holding.symbol)),[])

    if(marketDataForHoldings.receivedAt < yesterday || SymbolsOfHoldingsWithMarketData.sort().toString()!== Object.keys(marketDataForHoldings.items).sort().toString()){
      this.props.dispatch(fetchMarketDataForHoldings(holdingsWithMarketData))
    }

  }

  render() {
    return (
      <PieChartWithData portfolio={portfolio}/>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...state
});

export default connect(mapStateToProps)(App)
