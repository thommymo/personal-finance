
import React, { Component } from 'react'
//import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, Legend, XAxis, YAxis} from 'recharts'
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, Tooltip, XAxis, YAxis, Title, LineSeries,
} from 'react-jsx-highstock';

const colors = [
  "#A11478",
  "#A1162C",
  "#A14E18",
  "#A19919",
  "#1CA120",
  "#1EA16A",
  "#1F91A1",
]

class LineChartWithData extends Component {

  transformDataForHighStocks(data){
    const start = new Date("2007-12-30").getTime()
    if (this.props.loadingStatus === "loaded"){
      var transformedData = []
      var symbols = Object.keys(this.props.data)
      for (let symbol of symbols){
        transformedData[symbol] = Object.keys(this.props.data[symbol])
        .filter(date => {
          var timestamp = new Date(date).getTime()
          if(start<timestamp)
            return true
          else
            return false
        })
        .map(date => {
          var timestamp = new Date(date).getTime()
          return [
            timestamp,
            parseFloat(this.props.data[symbol][date]["5. adjusted close"])
          ]
        })
        transformedData[symbol].sort((a,b) => (a[0]-b[0]))
      }
      return transformedData
    }
  }

  render(){
    var data = {}
    if(this.props.data){
      data = this.transformDataForHighStocks(this.props.data)
    }
    var symbols=[]
    if(data){
      symbols = Object.keys(data)
    }

    return(
        <HighchartsStockChart>
          <Chart zoomType="x" />
          <Title>Highstocks example</Title>
          <XAxis>
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>
          <Tooltip valueSuffix=" CHF" shared valueDecimals={2}/>
          <YAxis id="shares-and-bonds">
            { symbols.map((symbol, index) => (
              <LineSeries id={symbol} name={symbol} data={data[symbol]} key={symbol} tooltip={{valueDecimals: 2}} compare="percent" color={colors[index]}/>
            ))}
          </YAxis>
        </HighchartsStockChart>
    )
  }
}

export default withHighcharts(LineChartWithData, Highcharts);
