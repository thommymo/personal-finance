import React, { Component } from 'react'
import AppWithData from './components/data/app-with-data'
import './utils/global-css'
import { portfolio, holdingsWithMarketPrice } from './data/data'
import { connect } from 'react-redux'
import { fetchPortfolio} from './actions'

/*
TODO:
- prevent rerendering
*/

class App extends Component {

  componentDidMount(){
    const { dispatch, exchangeRates, marketDataForHoldings } = this.props
    if(this.props.portfolio.items.length===0){
      //Loading initial portfolio state
      dispatch(fetchPortfolio(portfolio, holdingsWithMarketPrice, marketDataForHoldings, exchangeRates))
    } else if(this.props.portfolio.items.length > 0){
      //fetching portfolio if portfolio was changed by the user
      dispatch(fetchPortfolio(this.props.portfolio.items, holdingsWithMarketPrice, marketDataForHoldings, exchangeRates))
    }
  }

  isFetching(marketDataForHoldings){
    if(-1 === marketDataForHoldings.isFetching.findIndex(element=>element.isFetching===true)){
      if(marketDataForHoldings.isFetching.length > 0){
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }


  render() {

    const { marketDataForHoldings, exchangeRates } = this.props

    return (
      <div>
        { (this.isFetching(marketDataForHoldings) || exchangeRates.isFetching) &&
          <div>Loading Data...</div>
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

const mapStateToProps = (state, props) => ({
  ...state
});

export default connect(mapStateToProps)(App)
