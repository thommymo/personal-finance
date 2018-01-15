import React, { Component } from 'react'
import { theme } from '../../utils/theme'
import styled from 'styled-components'
import {
  HighchartsChart, Chart, withHighcharts, PieSeries
} from 'react-jsx-highcharts'
import Highcharts from 'highcharts'

Highcharts.setOptions({
 colors: theme.colors.chartColors
});

Highcharts.setOptions({
    chart: {
        style: {
            fontFamily: `${theme.font.fontFamily}, ${theme.font.serif}`
        }
    }
});

const colors = Highcharts.getOptions().colors

class PieChart extends Component {

  getSumOf(portfolio, holdingsWithMarketPrice, currency, shareValue){
    return portfolio
           .reduce((accumulator, holding) => {
              if(holdingsWithMarketPrice.some(find => find === holding.type)){
                if(shareValue[holding.symbol]){
                  return accumulator+=holding.y*shareValue[holding.symbol]/currency[holding.currency]
                } else {
                  return accumulator
                }
              } else {
                return accumulator+=holding.y/currency[holding.currency]
              }
            },0)
  }

  getHoldings(portfolio, holdingsWithMarketPrice, currency, shareValue, typesOfHoldings){
    return portfolio.map((holding, index) => {
      let type = typesOfHoldings.find(element => (element.type === holding.type))
      let brightness = 0.1 - ( index%type.countValues / type.countValues ) / 2
      const holdingInCHF = this.getValueInCHF(holding, holdingsWithMarketPrice, currency, shareValue)
      return {
        name: holding.name,
        y: holdingInCHF,
        type: holding.type,
        color: Highcharts.Color(type.color).brighten(brightness).get(),
        dataLabels: {
          backgroundColor: Highcharts.Color(type.color).brighten(brightness).get()
        }
      }
    })
  }

  getTypesOfHoldings(portfolio, holdingsWithMarketPrice, currency, shareValue){
    return portfolio.reduce((accumulator, holding, index) => {

     if(accumulator.some((element) => (element.type === holding.type))){

       let sum = accumulator.filter((element) => (element.type === holding.type))[0]
       const holdingInCHF = this.getValueInCHF(holding, holdingsWithMarketPrice, currency, shareValue)

       sum.y = sum.y + holdingInCHF
       sum.countValues = sum.countValues+1
       return  accumulator.filter((element) => (element.type !== holding.type)).concat(sum)
     } else {
       const holdingInCHF = this.getValueInCHF(holding, holdingsWithMarketPrice, currency, shareValue)
       return  accumulator.concat({
         name: holding.type,
         y: holdingInCHF,
         description: holding.type,
         type: holding.type,
         color: colors[accumulator.length],
         dataLabels: {
           backgroundColor: Highcharts.Color(colors[accumulator.length]).brighten(-0.1).get()
         },
         countValues: 1,
         sortOrder: accumulator.length
       })
     }
    },
    [])
  }

  getValueInCHF(portfolioElement, holdingsWithMarketPrice, currency, shareValue){
    let valueInCHF = holdingsWithMarketPrice.some(find => find === portfolioElement.type) ? portfolioElement.y*shareValue[portfolioElement.symbol]/currency[portfolioElement.currency] : portfolioElement.y/currency[portfolioElement.currency]
    if(isNaN(valueInCHF)){
      //TODO: Dispatch an error?
      return 0
    }else{
      return valueInCHF
    }
  }

  filterOnClick(clickedFilter){

    const {portfolio, holdingsWithMarketPrice, shareValue, currency, setPortfolioSelection, filter} = this.props

    if(!filter){
      const typesOfHoldings = this.getTypesOfHoldings(portfolio, holdingsWithMarketPrice, currency, shareValue).filter((holding) => (holding.type === clickedFilter))
      const color = typesOfHoldings[0].color
      setPortfolioSelection(clickedFilter, color)
    } else {
      setPortfolioSelection(false)
    }
  }

  render() {
    const { portfolio, holdingsWithMarketPrice, shareValue, currency, filter } = this.props

    let filteredPortfolio
    if(filter){
      filteredPortfolio = portfolio.filter(holding => (holding.type === filter))
    } else {
      filteredPortfolio = portfolio
    }
    let typesOfHoldings = this.getTypesOfHoldings(portfolio, holdingsWithMarketPrice, currency, shareValue)
    if(filter)  {
      typesOfHoldings = typesOfHoldings.filter((holding) => (holding.type === filter || !filter))
    }
    const holdings = this.getHoldings(filteredPortfolio, holdingsWithMarketPrice, currency, shareValue, typesOfHoldings)
    const sum = this.getSumOf(filteredPortfolio, holdingsWithMarketPrice, currency, shareValue)
    const color=theme.colors.chartColors[typesOfHoldings[0].sortOrder]
    const sumBgColor = filter ? color : theme.colors.black

    return (
      <StyledPieChartWithData>
        <TitleHeader>
          <div>
            <H1Centered>
              { filter &&
                <BackLink onClick={ () => this.filterOnClick({filter: false})}>Your Portfolio</BackLink>
              }
              { filter ? " / " + filter: "Your Portfolio" }
            </H1Centered>
            <H4Centered bgColor={sumBgColor}>{sum.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</H4Centered>
          </div>
        </TitleHeader>
        <HighchartsChart>
          <Chart />
          <PieSeries
            id="typesOfHoldings"
            name="Type of Holdings"
            data={typesOfHoldings}
            size="40%"
            inside={true}
            allowPointSelect={true}
            dataLabels={{
              connectorWidth:2,
              color: theme.colors.white,
              allowOverlap: false,
              backgroundColor: filter ? false: theme.colors.blackTransparent,
              distance: filter ? -80: 100,
              borderWidth: 5,
              borderColor: "transparent",
              style: {
                textOutline: false,
                fontSize: theme.fontSize.p.desktop
              }
            }}
            borderWidth={2}
            animation={false}
            color={typesOfHoldings}
            cursor="pointer"
            events={{
              cursor: 'pointer',
              click: (event) => this.filterOnClick(event.point.name),
            }}/>
          { filter &&
            <PieSeries
              id="holdings"
              name="Holdings"
              borderWidth = {2}
              data={holdings}
              size="80%"
              innerSize="60%"
              color={holdings}
              animation={true}
              dataLabels={filter ? {
                connectorWidth:2,
                connectorPadding:-4,
                color: theme.colors.white,
                allowOverlap: false,
                backgroundColor: theme.colors.blackTransparent,
                defer: false,
                distance:20,
                style: {
                  textOutline: false,
                  fontSize: theme.fontSize.p.desktop
                },
              }: false}
            />
          }
        </HighchartsChart>
      </StyledPieChartWithData>
    )
  }
}

export default withHighcharts(PieChart, Highcharts);

const TitleHeader = styled.header`
  display: flex;
  justify-content:center;
`
const BackLink = styled.span`
   display: inline-block;
   cursor: pointer;
   text-decoration: underline;
   :hover {
     color: ${theme.colors.green}
   }
`
const H1Centered = styled.h1`
  text-align: center;
`
const H4Centered = styled.h4`
  text-align: center;
  background: ${props => props.bgColor};
  color: ${theme.colors.white};
  font-weight: 200;
  padding:5px;
`
const StyledPieChartWithData = styled.div`
  height:90vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
`
