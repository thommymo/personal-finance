import React, { Component } from 'react'
import { portfolio, currency, holdingsWithMarketPrice, shareValue } from '../../data/data'
import PieChart from '../../components/molecules/piechart'
import { connect } from 'react-redux'
import TableWithHoldings from '../molecules/tablewithholdings'
import TableWithHoldingsFinMarkets from '../molecules/tablewithholdingsfinmarkets'
import { setPortfolioSelection } from '../../components/data/actions'
import LineChartWithData from '../../components/data/linechartwithdata'

//Data will come from a database later, instead of the import from "../../data/data"

/*
TODO
//Check which steps are really necessary
2. If no Data is available: Show error message
3. If no Data in IndexedDB, but data is loading: Show Loading message
4. If Data in IndexedDB, show with old data and load new data in background
5. If New Data from API, show data
*/

class PieChartWithData extends Component {
  setPortfolioSelection(holdingsType,color){
    this.props.dispatch(setPortfolioSelection(holdingsType,color))
  }
  render() {
    console.log(this.props);
    const { holdingsType, color } = this.props.selection
    const exchangeRates = this.props.exchangeRates.rates
    return (
      <div>
        { exchangeRates.isFetching &&
          //TODO: Add a beautiful Loading state
          <div>Loading</div>
        }
        { !exchangeRates.isFetching && !exchangeRates &&
          //TODO: Add a beautiful Error state
          <div>Error</div>
        }
        { !exchangeRates.isFetching && exchangeRates &&
          <PieChart
            setPortfolioSelection={(holdingsType,color)=>this.setPortfolioSelection(holdingsType,color)}
            portfolio={portfolio}
            currency={exchangeRates}
            holdingsWithMarketPrice={holdingsWithMarketPrice}
            shareValue={shareValue}
          />
        }
        { !exchangeRates.isFetching && exchangeRates && holdingsType && !holdingsWithMarketPrice.some(holding => holding===holdingsType) &&
          <TableWithHoldings
            portfolioSelection={holdingsType}
            color={color}
            portfolio={portfolio}
            currency={exchangeRates}
            holdingsWithMarketPrice={holdingsWithMarketPrice}
            shareValue={shareValue}
          />
        }
        { !exchangeRates.isFetching && exchangeRates && holdingsType && holdingsWithMarketPrice.some(holding => holding===holdingsType) &&
          <div>
            <TableWithHoldingsFinMarkets
              portfolioSelection={holdingsType}
              color={color}
              shareValue={shareValue}
              portfolio={portfolio}
              exchangeRates={exchangeRates}
              currency={exchangeRates}
              holdingsWithMarketPrice={holdingsWithMarketPrice}
              shareValue={shareValue}
            />
            <LineChartWithData symbols={portfolio.filter(holding => holding.type===this.props.selection.holdingsType)}/>
          </div>

        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...state
});

export default connect(mapStateToProps)(PieChartWithData)
