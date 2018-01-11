import React, { Component } from 'react'
import { portfolio, holdingsWithMarketPrice } from '../../data/data'
import PieChart from '../molecules/piechart'
import { connect } from 'react-redux'
import TableWithHoldings from '../molecules/tablewithholdings'
import TableWithHoldingsFinMarkets from '../molecules/tablewithholdingsfinmarkets'
import { setPortfolioSelection } from '../../actions'
import LineChart from '../molecules/linechart'

//Data will come from a database later, instead of the import from "../../data/data"

/*
TODO
//Check which steps are really necessary
2. If no Data is available: Show error message
3. If no Data in IndexedDB, but data is loading: Show Loading message
4. If Data in IndexedDB, show with old data and load new data in background
5. If New Data from API, show data
*/

class AppWithData extends Component {
  setPortfolioSelection(holdingsType,color){
    this.props.dispatch(setPortfolioSelection(holdingsType,color))
  }
  render() {
    const { holdingsType, color } = this.props.selection
    const shareValue = Object.keys(this.props.marketDataForHoldings.items).reduce((acc, symbol)=>{
      const data = this.props.marketDataForHoldings.items[symbol]["Monthly Adjusted Time Series"]
      const allDates = Object.keys(data).sort((a,b)=>(a > b))
      acc[symbol] = parseFloat(data[allDates[(allDates.length-1)]]["5. adjusted close"])
      return acc
    },{})

    const exchangeRates = this.props.exchangeRates.rates
    const filteredSymbols = portfolio.filter(holding => (holding.type === holdingsType)).map(holding => holding.symbol)
    const filteredMarketData = filteredSymbols.reduce((acc,symbol)=>{
        acc[symbol] = this.props.marketDataForHoldings.items[symbol]
        return acc
      },{})
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
            filter={holdingsType}
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
            />
            <LineChart loadingStatus="loaded" data={filteredMarketData} color={color} holdingsType={holdingsType}/>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...state
});

export default connect(mapStateToProps)(AppWithData)
