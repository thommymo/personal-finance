import React, { Component } from 'react'
import AppWithData from './components/data/app-with-data'
import './utils/global-css'
import { portfolio, holdingsWithMarketPrice } from './data/data'
import { connect } from 'react-redux'
import { fetchPortfolio} from './actions'
import { LoadingIndicator } from './components/atoms/loading-indicator'

/*
TODO:
- prevent rerendering
*/

class App extends Component {

  componentDidMount(){
    const { dispatch, exchangeRates, marketDataForHoldings, portfolio } = this.props
    dispatch(fetchPortfolio(portfolio.items, holdingsWithMarketPrice, marketDataForHoldings, exchangeRates))
  }

  isFetching(marketDataForHoldings){
    if(-1 === marketDataForHoldings.isFetching.findIndex(element=>element.isFetching===true)){
      return false
    } else {
      return true
    }
  }

  render() {

    const { marketDataForHoldings, exchangeRates } = this.props

    return (
      <div>
        { (this.isFetching(marketDataForHoldings) || exchangeRates.isFetching) &&
          <LoadingIndicator />
        }
        { marketDataForHoldings.error &&
          //TODO: Make Error Messages more accurate
          <div>{marketDataForHoldings.error.errorMessage}</div>
        }
        { !this.isFetching(marketDataForHoldings) && !exchangeRates.isFetching &&
          <AppWithData />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  console.log(state)
  return {
  ...state
  // dispatch: state.dispatch,
  // exchangeRates: state.exchangeRates,
  // portfolio: state.portfolio.items,
  // marketDataForHoldings: state.marketDataForHoldings,
}};

export default connect(mapStateToProps)(App)
