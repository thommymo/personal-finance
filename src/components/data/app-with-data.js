import React, { Component } from 'react'
import { holdingsWithMarketPrice } from '../../data/data'
import PieChart from '../molecules/piechart'
import { connect } from 'react-redux'
import TableWithHoldings from '../molecules/tablewithholdings'
import TableWithHoldingsFinMarkets from '../molecules/tablewithholdingsfinmarkets'
import { setPortfolioSelection, removeInvestment, editInvestment, updateInvestment, cancelEditingInvestment, fetchMarketDataForHolding } from '../../actions'
import LineChart from '../molecules/linechart'
import AddInvestment from '../data/add-investment'
import styled from 'styled-components'

class AppWithData extends Component {

  setPortfolioSelection(holdingsType,color){
    this.props.dispatch(setPortfolioSelection(holdingsType,color))
  }

  render() {
    const { holdingsType, color } = this.props.selection
    const { marketDataForHoldings, portfolio, dispatch } = this.props

    const exchangeRates = this.props.exchangeRates.rates
    const filteredPortfolio = portfolio.items.filter(holding => (holding.type === holdingsType))

    const marketData = portfolio.items.reduce((acc, holding)=> {
      if(holding.symbol){
        let marketDataForSymbol = this.props.marketDataForHoldings.items[holding.symbol]
        if(marketDataForSymbol !== undefined){
          acc[holding.symbol] = marketDataForSymbol
        } else {
          dispatch(fetchMarketDataForHolding(holding))
        }
        return acc
      } else {
        return acc
      }
    },{})

    const filteredMarketData = marketData

    const shareValue = Object.keys(marketData).reduce((acc, symbol)=>{
      if(Object.keys(marketDataForHoldings.items[symbol]).length>0){
        const data = marketDataForHoldings.items[symbol]["Monthly Adjusted Time Series"]
        const allDates = Object.keys(data).sort((a,b)=>(a > b))
        acc[symbol] = parseFloat(data[allDates[(allDates.length-1)]]["5. adjusted close"])
      }
      return acc
    },{})

    return (
      <ChartWrapper>
        { portfolio.items.length>0 &&
          <PieChart
            filter={holdingsType}
            setPortfolioSelection={(holdingsType,color)=>this.setPortfolioSelection(holdingsType,color)}
            portfolio={portfolio.items}
            currency={exchangeRates}
            holdingsWithMarketPrice={holdingsWithMarketPrice}
            shareValue={shareValue}
          />
        }
        <ButtonWrapper>
          <AddInvestment />
        </ButtonWrapper>
        { holdingsType && !holdingsWithMarketPrice.some(holding => holding===holdingsType) &&
          <TableWithHoldings
            portfolioSelection={holdingsType}
            color={color}
            portfolio={portfolio.items}
            currency={exchangeRates}
            removeInvestment={(holding)=>dispatch(removeInvestment(holding))}
            editInvestment={(holding)=>dispatch(editInvestment(holding))}
            saveInvestment={(oldHolding,updatedHolding)=>dispatch(updateInvestment(oldHolding,updatedHolding))}
            cancelEditingInvestment={(holding)=>dispatch(cancelEditingInvestment(holding))}
          />
        }
        { holdingsType && holdingsWithMarketPrice.some(holding => holding===holdingsType) &&
          <div>
            <TableWithHoldingsFinMarkets
              portfolioSelection={holdingsType}
              color={color}
              shareValue={shareValue}
              portfolio={portfolio.items}
              currency={exchangeRates}
              removeInvestment={(holding)=>dispatch(removeInvestment(holding))}
              editInvestment={(holding)=>dispatch(editInvestment(holding))}
              saveInvestment={(oldHolding,updatedHolding)=>dispatch(updateInvestment(oldHolding,updatedHolding))}
              cancelEditingInvestment={(holding)=>dispatch(cancelEditingInvestment(holding))}
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
