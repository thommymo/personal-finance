import React, { Component } from 'react'

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
  { name: "DBK EUR Privatkonto", y: 841, description: "Cash", type: "cash", denomination: "EUR" },
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
  JNK:50,
  AAPL:50,
  MSFT:50,
  XAU:50,
  SMI:50,
}

const colors = Highcharts.getOptions().colors

const types = portfolio.reduce((accumulator, value, index) => {
 if(accumulator.some((element) => (element.type === value.type))){
   let sum = accumulator.filter((element) => (element.type === value.type))[0]
   sum.y = sum.y + value.y
   sum.countValues = sum.countValues+1
   return  accumulator.filter((element) => (element.type !== value.type)).concat(sum)
 } else {
   return  accumulator.concat({ name: value.type, y: value.y, description: value.type, type: value.type, color: colors[accumulator.length], countValues: 1})
 }
},
[])

const portfolioValues = portfolio.map((value, index) => {
  let type = types.find(element => (element.type === value.type))
  let brightness = 0.2 - ( index%4 / type.countValues ) / 5
  return { name: value.name, y: value.y, type: value.type, color: Highcharts.Color(type.color).brighten(brightness).get()}
})

const sum = portfolio.reduce((accumulator, value) => {
  if(value.type==="share"){
    return accumulator+=value.y*shareValue[value.name]
  } else {
    return accumulator+=value.y*denomination[value.denomination]
  }

},0)

class PieChartWithData extends Component {
  render() {
    return (
      <HighchartsChart>
        <Title>my Portfolio, current (value: {sum})</Title>
        <PieSeries data={types} size="60%" dataLabels={{color: '#ffffff', distance: -30}} color={types}/>
        <PieSeries data={portfolioValues} size="80%" innerSize="60%" color={portfolioValues}/>
      </HighchartsChart>
    )
  }

}

export default withHighcharts(PieChartWithData, Highcharts);
