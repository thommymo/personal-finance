import React, { Component } from 'react'
import { portfolio, holdingsWithMarketPrice } from '../../data/data'
import PieChart from '../molecules/piechart'
import { connect } from 'react-redux'
import TableWithHoldings from '../molecules/tablewithholdings'
import TableWithHoldingsFinMarkets from '../molecules/tablewithholdingsfinmarkets'
import { setPortfolioSelection } from '../../actions'
import LineChart from '../molecules/linechart'
import AddInvestment from '../data/add-investment'
import styled from 'styled-components'

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
    const { marketDataForHoldings, portfolio } = this.props
    const shareValue = Object.keys(marketDataForHoldings.items).reduce((acc, symbol)=>{
      if(Object.keys(marketDataForHoldings.items[symbol]).length>0){
        const data = marketDataForHoldings.items[symbol]["Monthly Adjusted Time Series"]
        const allDates = Object.keys(data).sort((a,b)=>(a > b))
        acc[symbol] = parseFloat(data[allDates[(allDates.length-1)]]["5. adjusted close"])
      }
      return acc
    },{})

    const exchangeRates = this.props.exchangeRates.rates
    const filteredSymbols = portfolio.items.filter(holding => (holding.type === holdingsType)).map(holding => holding.symbol)
    const filteredMarketData = filteredSymbols.reduce((acc,symbol)=>{
        let marketDataForSymbol = this.props.marketDataForHoldings.items[symbol]
        if(marketDataForSymbol !== undefined){
          acc[symbol] = marketDataForSymbol
        }
        return acc
      },{})
    return (
      <ChartWrapper>
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
            portfolio={portfolio.items}
            currency={exchangeRates}
            holdingsWithMarketPrice={holdingsWithMarketPrice}
            shareValue={shareValue}
          />
        }
        <ButtonWrapper><AddInvestment /></ButtonWrapper>
        { !exchangeRates.isFetching && exchangeRates && holdingsType && !holdingsWithMarketPrice.some(holding => holding===holdingsType) &&
          <TableWithHoldings
            portfolioSelection={holdingsType}
            color={color}
            portfolio={portfolio.items}
            currency={exchangeRates}
          />
        }
        { !exchangeRates.isFetching && exchangeRates && holdingsType && holdingsWithMarketPrice.some(holding => holding===holdingsType) &&
          <div>
            <TableWithHoldingsFinMarkets
              portfolioSelection={holdingsType}
              color={color}
              shareValue={shareValue}
              portfolio={portfolio.items}
              exchangeRates={exchangeRates}
            />
            <LineChart loadingStatus="loaded" data={filteredMarketData} color={color} holdingsType={holdingsType}/>
          </div>
        }

      </ChartWrapper>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...state
});

export default connect(mapStateToProps)(AppWithData)

const ChartWrapper = styled.div`
  display: block;
  flex-direction: column;
  align-items:center;
  width: 100vw;
`
const ButtonWrapper = styled.div`
  display: flex;
  width:100%;
  align-items:center;
  justify-content: center;
`
