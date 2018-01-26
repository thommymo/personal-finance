import React, { Component } from "react"
import AppWithData from "./data/app-with-data"
import "../utils/global-css"
import { holdingsWithMarketPrice } from "../data/data"
import { connect } from "react-redux"
import { fetchPortfolio, fetchUser } from "../actions"
import { LoadingIndicator } from "./atoms/loading-indicator"
import { BrowserRouter, Route } from "react-router-dom"

/*
TODO:
- prevent rerendering
*/

class App extends Component {
  componentDidMount() {
    const {
      dispatch,
      exchangeRates,
      marketDataForHoldings,
      portfolio
    } = this.props
    dispatch(
      fetchPortfolio(
        portfolio.items,
        holdingsWithMarketPrice,
        marketDataForHoldings,
        exchangeRates
      )
    )
    dispatch(fetchUser())
  }

  isFetching(marketDataForHoldings) {
    if (
      -1 ===
      marketDataForHoldings.isFetching.findIndex(
        element => element.isFetching === true
      )
    ) {
      return false
    } else {
      return true
    }
  }

  render() {
    const { marketDataForHoldings, exchangeRates } = this.props

    return (
      <BrowserRouter>
        <div>
          <a href="/auth/google">Login with Google</a>
          <Route path="/" exact>
            <div>
              {(this.isFetching(marketDataForHoldings) ||
                exchangeRates.isFetching) && <LoadingIndicator />}
              {marketDataForHoldings.error && (
                //TODO: Make Error Messages more accurate
                <div>{marketDataForHoldings.error.errorMessage}</div>
              )}
              {!this.isFetching(marketDataForHoldings) &&
                !exchangeRates.isFetching && <AppWithData />}
            </div>
          </Route>
        </div>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...state })

export default connect(mapStateToProps)(App)
