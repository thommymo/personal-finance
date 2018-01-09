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
    const { exchangeRates } = this.props
    return (
      <div>
        { exchangeRates.isFetching &&
          <div>Loading</div>
        }
        { !exchangeRates.isFetching && !exchangeRates.rates &&
          <div>Error</div>
        }
        { !exchangeRates.isFetching && exchangeRates.rates &&
          <PieChart
            portfolio={portfolio}
            currency={exchangeRates.rates}
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
