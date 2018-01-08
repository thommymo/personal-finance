import React, { Component } from 'react'
import {theme} from './utils/theme'
import styled from 'styled-components'

import {
  HighchartsChart, Pie, Chart, withHighcharts, Tooltip, XAxis, YAxis, Title, Subtitle, PieSeries
} from 'react-jsx-highcharts'
import Highcharts from 'highcharts'

const portfolio =  [
  { name: "DKB EUR Privatkonto", y: 841, description: "Cash", type: "Cash", denomination: "EUR" },
  { name: "Postfinance Privatkonto 2", y: 3361, description: "Cash", type: "Cash", denomination: "CHF" },
  { name: "Postfinance Privatkonto", y: 13402, description: "Cash", type: "Cash", denomination: "CHF" },
  { name: "Postfinance Sparkonto", y: 60806, description: "Cash", type: "Cash", denomination: "CHF" },
  { name: "True Wealth GBP Account", y: 41, description: "Cash", type: "Cash", denomination: "GBP"  },
  { name: "True Wealth USD Account", y: 404, description: "Cash", type: "Cash", denomination: "USD"  },
  { name: "True Wealth EUR Account", y: 86, description: "Cash", type: "Cash", denomination: "EUR"  },
  { name: "True Wealth CHF Account", y: 41, description: "Cash", type: "Cash", denomination: "CHF"  },
  { name: "ABL kurzfristig", y: 20300, description: "Cash", type: "Cash", denomination: "CHF", interest: 0.1 },
  { name:"SPDR® FTSE UK All Share UCITS ETF", y: 17, type: "Equities", exchange: "SWX", symbol: 'IE00B7452L46', denomination: "GBP"},
  { name:"iShares STOXX Europe 600 UCITS ETF", y: 32, type: "Equities", exchange: "SWX", symbol: 'DE0002635307', denomination: "EUR"},
  { name:"Vanguard US Total Stock Market Shares Index ETF", y: 8, type: "Equities", exchange: "NYSE", symbol: 'VTI', denomination: "USD"},
  { name:"Vanguard FTSE Emerging Markets ETF", y: 34, type: "Equities", exchange: "NYSE", symbol: 'VWO', denomination: "USD"},
  { name:"Vanguard FTSE Pacific ETF", y: 13, type: "Equities", exchange: "NYSE", symbol: 'VPL', denomination: "USD"},
  { name:"UBS ETF (CH) - SMI (CHF)", y: 96, type: "Equities", exchange: "SWX", symbol: 'CH0017142719', denomination: "CHF"},
  { name:"ZKB Gold ETF A (CHF)", y: 5, type: "Natural Resources", exchange: "SWX", symbol: 'CH0139101593', denomination: "CHF"},
  { name:"ETFS Longer Dated All Commodities GO UCITS ETF", y: 180, type: "Natural Resources", exchange: "SWX", symbol: 'IE00B4WPHX27', denomination: "USD"},
  { name:"Vanguard REIT ETF", y: 25, type: "Real Estate", exchange: "NYSE", symbol: 'VNQ', denomination: "USD"},
  { name:"Vanguard Global ex-US Real Estate ETF", y: 13, type: "Real Estate", exchange: "NYSE", symbol: 'VNQI', denomination: "USD"},

  { name: "ABL 8 Jahre", y: 20000, description: "Cash", type: "Private Loan", denomination: "CHF", interest: 1.5 },
  { name: "ABL Genossenschaftsanteile", y: 4000, description: "Coop", type: "coop", denomination: "CHF", interest: 2.5 },
  { name: "Viac 3a Konto", y: 6768, description: "Retirement Cash", type: "Retirement Money", denomination: "CHF", interest: 0.3 },
  { name: "Postfinance 3a Konto", y: 20782, description: "Retirement Cash", type: "Retirement Money", denomination: "CHF", interest: 0.3 },
  { name: "Postfinance 3a Konto", y: 21490, description: "Retirement Cash", type: "Retirement Money", denomination: "CHF", interest: 0.3 },
  { name: "Postfinance 3a Konto", y: 13616, description: "Retirement Cash", type: "Retirement Money", denomination: "CHF", interest: 0.3 },
  { name: "LUPK Pensionskasse", y: 94000, description: "Retirement Cash", type: "Retirement Money", denomination: "CHF", interest: 1.5 },
]

const denomination = {
  GBP: 1.2,
  CHF: 1,
  USD: 0.95,
  EUR: 1.15
}

const holdingsWithMarketPrice = [
  "Equities",
  "Natural Resources",
  "Real Estate",
]

const shareValue = {
  IE00B7452L46:51.12,
  DE0002635307:39.07,
  VTI:140.37,
  VWO:47.86,
  VPL:75.01,
  CH0017142719:96.96,
  CH0139101593:394.20,
  IE00B4WPHX27:14.34,
  VNQ:81.05,
  VNQI: 62.38
}

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
  constructor(){
    super()
    this.state = {
      typesOfHoldings: this.getTypesOfHoldings(portfolio),
      holdings: this.getHoldings(portfolio),
      sum: this.getSumOf(portfolio),
      filter: false
    }
  }
  getSumOf(portfolio, filter){
    return portfolio
           .filter((holding) => (!filter || holding.type === filter))
           .reduce((accumulator, value) => {
              if(holdingsWithMarketPrice.some(find => find === value.type)){
                return accumulator+=value.y*shareValue[value.symbol]*denomination[value.denomination]
              } else {
                return accumulator+=value.y*denomination[value.denomination]
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
         countValues: 1
       })
     }
    },
    [])
  }
  getValueInCHF(portfolioElement){
    return holdingsWithMarketPrice.some(find => find === portfolioElement.type) ? portfolioElement.y*shareValue[portfolioElement.symbol]*denomination[portfolioElement.denomination] : portfolioElement.y*denomination[portfolioElement.denomination]
  }

  onClickFilter(filter){
    if(!this.state.filter){
      this.setState(
        {
          typesOfHoldings: this.getTypesOfHoldings(portfolio).filter((holding) => (holding.type === filter)),
          holdings: this.getHoldings(portfolio).filter((holding) => (holding.type === filter)),
          filter: filter,
          sum: this.getSumOf(portfolio, filter)
        }
      )
    } else {
      this.setState(
        {
          typesOfHoldings: this.getTypesOfHoldings(portfolio),
          holdings: this.getHoldings(portfolio),
          filter: false,
          sum: this.getSumOf(portfolio)
        }
      )
    }
  }
  render() {
    return (
      <div>
        <ChartsTitle>
          <H3Centered>
            { this.state.filter &&
              <BackLink onClick={ () => this.onClickFilter({filter: false})}>My Portfolio</BackLink>
            }
            { this.state.filter ? " / " + this.state.filter: "My Portfolio" }
          </H3Centered>
          <H4Centered>{this.state.sum.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</H4Centered>
        </ChartsTitle>
        <HighchartsChart>
          <Chart />
          <PieSeries
            id="typesOfHoldings"
            name="Type of Holdings"
            data={this.state.typesOfHoldings}
            size="40%"
            dataLabels={{
              connectorWidth:2,
              color: theme.colors.white,
              allowOverlap: false,
              backgroundColor: this.state.filter ? false: theme.colors.blackTransparent,
              distance: this.state.filter ? -50: 30,
              borderWidth: 5,
              borderColor: "transparent",
              style: {
                textOutline: false,
                fontSize: theme.fontSize.p.desktop
              }
            }}
            animation={false}
            color={this.state.typesOfHoldings}
            cursor="pointer"
            events={{
              cursor: 'pointer',
              click: (event) => this.onClickFilter(event.point.name),
            }}/>
          { this.state.filter &&
            <PieSeries
              id="holdings"
              name="Holdings"
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
                }
              }: false}
            />
          }

        </HighchartsChart>
      </div>
    )
  }

}

export default withHighcharts(PieChartWithData, Highcharts);

const ChartsTitle = styled.div`

`
const BackLink = styled.span`

   display: inline-block;
   cursor: pointer;
   text-decoration: underline;

   :hover {
     color: ${theme.colors.green}
   }
`
const H3Centered = styled.h3`
  text-align: center;
`
const H4Centered = styled.h5`
  text-align: center;
`
