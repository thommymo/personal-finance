import React, { Component } from 'react'
import { theme } from '../../utils/theme'
import styled from 'styled-components'
import {
  HighchartsChart, Pie, Chart, withHighcharts, Tooltip, XAxis, YAxis, Title, Subtitle, PieSeries
} from 'react-jsx-highcharts'
import Highcharts from 'highcharts'
import { currency, holdingsWithMarketPrice, shareValue } from '../../data/data'

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

class PieChartWithData extends Component {

  componentWillMount(){
    const portfolio = this.props.portfolio
    this.setState({
      typesOfHoldings: this.getTypesOfHoldings(portfolio),
      holdings: this.getHoldings(portfolio),
      sum: this.getSumOf(portfolio),
      filter: false,
      sumBgColor: theme.colors.black
    })
  }
  getSumOf(portfolio, filter){
    return portfolio
           .filter((holding) => (!filter || holding.type === filter))
           .reduce((accumulator, value) => {
              if(holdingsWithMarketPrice.some(find => find === value.type)){
                return accumulator+=value.y*shareValue[value.symbol]*currency[value.currency]
              } else {
                return accumulator+=value.y*currency[value.currency]
              }
            },0)
  }
  getHoldings(portfolio){
    return portfolio.map((holding, index) => {
      let type = this.getTypesOfHoldings(portfolio).find(element => (element.type === holding.type))
      let brightness = 0.1 - ( index%type.countValues / type.countValues ) / 2
      const holdingInCHF = this.getValueInCHF(holding)
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
  getTypesOfHoldings(portfolio){
    return portfolio.reduce((accumulator, holding, index) => {
     if(accumulator.some((element) => (element.type === holding.type))){
       let sum = accumulator.filter((element) => (element.type === holding.type))[0]
       const holdingInCHF = this.getValueInCHF(holding)
       sum.y = sum.y + holdingInCHF
       sum.countValues = sum.countValues+1
       return  accumulator.filter((element) => (element.type !== holding.type)).concat(sum)
     } else {
       const holdingInCHF = this.getValueInCHF(holding)
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
  getValueInCHF(portfolioElement){
    return holdingsWithMarketPrice.some(find => find === portfolioElement.type) ? portfolioElement.y*shareValue[portfolioElement.symbol]*currency[portfolioElement.currency] : portfolioElement.y*currency[portfolioElement.currency]
  }

  filterOnClick(filter){
    if(!this.state.filter){
      const typesOfHoldings = this.getTypesOfHoldings(this.props.portfolio).filter((holding) => (holding.type === filter))
      this.setState(
        {
          typesOfHoldings,
          holdings: this.getHoldings(this.props.portfolio).filter((holding) => (holding.type === filter)),
          filter: filter,
          sum: this.getSumOf(this.props.portfolio, filter),
          sumBgColor: theme.colors.chartColors[typesOfHoldings[0].sortOrder]
        }
      )
    } else {
      this.setState(
        {
          typesOfHoldings: this.getTypesOfHoldings(this.props.portfolio),
          holdings: this.getHoldings(this.props.portfolio),
          filter: false,
          sum: this.getSumOf(this.props.portfolio),
          sumBgColor: theme.colors.black
        }
      )
    }
  }
  render() {
    return (
      <StyledPieChartWithData>
        <TitleHeader>
          <div>
            <H1Centered>
              { this.state.filter &&
                <BackLink onClick={ () => this.filterOnClick({filter: false})}>Your Portfolio</BackLink>
              }
              { this.state.filter ? " / " + this.state.filter: "Your Portfolio" }
            </H1Centered>
            <H4Centered bgColor={this.state.sumBgColor}>{this.state.sum.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</H4Centered>
          </div>
        </TitleHeader>
        <HighchartsChart>
          <Chart />
          <PieSeries
            id="typesOfHoldings"
            name="Type of Holdings"
            data={this.state.typesOfHoldings}
            size="40%"
            inside={true}
            allowPointSelect={true}
            dataLabels={{
              connectorWidth:2,
              color: theme.colors.white,
              allowOverlap: false,
              backgroundColor: this.state.filter ? false: theme.colors.blackTransparent,
              distance: this.state.filter ? -80: 100,
              borderWidth: 5,
              borderColor: "transparent",

              style: {
                textOutline: false,
                fontSize: theme.fontSize.p.desktop
              }
            }}
            borderWidth={2}
            animation={false}
            color={this.state.typesOfHoldings}
            cursor="pointer"
            events={{
              cursor: 'pointer',
              click: (event) => this.filterOnClick(event.point.name),
            }}/>
          { this.state.filter &&
            <PieSeries
              id="holdings"
              name="Holdings"
              borderWidth = {2}
              data={this.state.holdings}
              size="80%"
              innerSize="60%"
              color={this.state.holdings}
              animation={true}
              dataLabels={this.state.filter ? {
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

export default withHighcharts(PieChartWithData, Highcharts);

const TitleHeader = styled.header`
  display: flex;
  justify-content:center;
`
const TitleArea = styled.div`
  flex:1;
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
  height:100vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
`
