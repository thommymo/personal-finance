import React, { Component } from 'react'
import { portfolio, currency, holdingsWithMarketPrice, shareValue } from '../../data/data'
import PieChart from '../../components/molecules/piechart'
import { connect } from 'react-redux'

//Data will come from a database later, instead of the import from "../../data/data"
//

/*
1. Get currency data from Alphavantage, Store data with Redux
2. If no Data is available: Show error message
3. If no Data in IndexedDB, but data is loading: Show Loading message
4. If Data in IndexedDB, show with old data and load new data in background
5. If New Data from API, show data
*/

class PieChartWithData extends Component {
  render() {
    return (
      <div>
        { this.props.exchangeRates.isFetching &&
          <div>Loading</div>
        }
        { !this.props.exchangeRates.isFetching && !this.props.exchangeRates.rates &&
          <div>Error</div>
        }
        { !this.props.exchangeRates.isFetching && this.props.exchangeRates.rates &&
          <PieChart
            portfolio={portfolio}
            currency={this.props.exchangeRates.rates}
            holdingsWithMarketPrice={holdingsWithMarketPrice}
            shareValue={shareValue}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...state
});

export default connect(mapStateToProps)(PieChartWithData)
