import React, { Component } from 'react'
import {theme} from './utils/theme'

import {
  HighchartsChart, Pie, Chart, withHighcharts, Tooltip, XAxis, YAxis, Title, PieSeries
} from 'react-jsx-highcharts'
import Highcharts from 'highcharts'

const portfolio =  [
  { name: "JNK", y: 20, description: "US Junk Bonds", type: "share", denomination: "GBP"  },
  { name: "AAPL", y: 20, description: "Apple Shares", type: "share", denomination: "GBP"  },
  { name: "MSFT", y: 20, description: "Microsoft Shares", type: "share", denomination: "GBP"  },
  { name: "XAU", y: 20, description: "Junk Bonds", type: "share", denomination: "GBP"  },
  { name: "SMI", y: 20, description: "Junk Bonds", type: "share", denomination: "GBP"  },
  { name: "DKB EUR Privatkonto", y: 841, description: "Cash", type: "cash", denomination: "EUR" },
  { name: "Postfinance Privatkonto 2", y: 3361, description: "Cash", type: "cash", denomination: "CHF" },
  { name: "Postfinance Privatkonto", y: 13402, description: "Cash", type: "cash", denomination: "CHF" },
  { name: "Postfinance Sparkonto", y: 60806, description: "Cash", type: "cash", denomination: "CHF" },
  { name: "True Wealth GBP Account", y: 41, description: "Cash", type: "cash", denomination: "GBP"  },
  { name: "True Wealth USD Account", y: 404, description: "Cash", type: "cash", denomination: "USD"  },
  { name: "True Wealth EUR Account", y: 86, description: "Cash", type: "cash", denomination: "EUR"  },
  { name: "True Wealth CHF Account", y: 41, description: "Cash", type: "cash", denomination: "CHF"  },
  { name: "ABL kurzfristig", y: 20300, description: "Cash", type: "private loan", denomination: "CHF", interest: 0.1 },
  { name: "ABL 8 Jahre", y: 20000, description: "Cash", type: "private loan", denomination: "CHF", interest: 1.5 },
  { name: "ABL Genossenschaftsanteile", y: 4000, description: "Coop", type: "coop", denomination: "CHF", interest: 2.5 },
  { name: "Viac 3a Konto", y: 6768, description: "Retirement Cash", type: "retirment cash", denomination: "CHF", interest: 0.3 },
  { name: "Postfinance 3a Konto", y: 20782, description: "Retirement Cash", type: "retirment cash", denomination: "CHF", interest: 0.3 },
  { name: "Postfinance 3a Konto", y: 21490, description: "Retirement Cash", type: "retirment cash", denomination: "CHF", interest: 0.3 },
  { name: "Postfinance 3a Konto", y: 13616, description: "Retirement Cash", type: "retirment cash", denomination: "CHF", interest: 0.3 },
]

const denomination = {
  GBP: 1.2,
  CHF: 1,
  USD: 0.95,
  EUR: 1.15
}

const shareValue = {
  JNK:2000,
  AAPL:200,
  MSFT:50,
  XAU:50,
  SMI:50,
}

Highcharts.setOptions({
 colors: ['#540D6E', '#EE4266', '#FFD23F', '#3BCEAC', '#0EAD69', '#FFF263', '#6AF9C4']
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
    return Math.floor(portfolio
           .filter((holding) => (!filter || holding.type === filter))
           .reduce((accumulator, value) => {
              if(value.type==="share"){
                return accumulator+=value.y*shareValue[value.name]
              } else {
                return accumulator+=value.y*denomination[value.denomination]
              }
            },0))
  }
  getHoldings(portfolio){
    return portfolio.map((holding, index) => {
      let type = this.getTypesOfHoldings(portfolio).find(element => (element.type === holding.type))
      let brightness = 0.2 - ( index%4 / type.countValues ) / 5
      const holdingInCHF = this.getValueInCHF(holding)
      return { name: holding.name, y: holdingInCHF, type: holding.type, color: Highcharts.Color(type.color).brighten(brightness).get()}
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
       return  accumulator.concat({ name: holding.type, y: holdingInCHF, description: holding.type, type: holding.type, color: colors[accumulator.length], countValues: 1})
     }
    },
    [])
  }
  getValueInCHF(portfolioElement){
    return portfolioElement.type === "share" ? portfolioElement.y*shareValue[portfolioElement.name] : portfolioElement.y*denomination[portfolioElement.denomination]
  }
  componentWillMount(){

  }
  componentDidMount(){

  }
  onClick(event){
    if(!this.state.filter){
      this.setState(
        {
          typesOfHoldings: this.getTypesOfHoldings(portfolio).filter((holding) => (holding.type === event.point.name)),
          holdings: this.getHoldings(portfolio).filter((holding) => (holding.type === event.point.name)),
          filter: "cash",
          sum: this.getSumOf(portfolio, event.point.name)
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
      <HighchartsChart>
        <Title>{`My Portfolio, current (value: CHF ${this.state.sum.toString()} )`}</Title>
        <PieSeries
          id="typesOfHoldings"
          data={this.state.typesOfHoldings}
          size="40%"
          dataLabels={{color: '#ffffff', distance: -30}}
          color={this.state.typesOfHoldings}
          cursor="pointer"
          events={{
            cursor: 'pointer',
            click: (event) => this.onClick(event),
          }}/>
        <PieSeries
          id="holdings"
          data={this.state.holdings}
          size="80%"
          innerSize="60%"
          color={this.state.holdings}
        />
      </HighchartsChart>
    )
  }

}

export default withHighcharts(PieChartWithData, Highcharts);
