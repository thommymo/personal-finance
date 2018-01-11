import React, { PureComponent } from 'react'
//import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, Legend, XAxis, YAxis} from 'recharts'
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, Tooltip, XAxis, YAxis, Title, LineSeries,
} from 'react-jsx-highstock';
import { theme } from '../../utils/theme'
import styled from 'styled-components'

Highcharts.setOptions({
    chart: {
        style: {
            fontFamily: `${theme.font.fontFamily}, ${theme.font.serif}`
        }
    }
});

class LineChart extends PureComponent {

  transformDataForHighStocks(data){
    const start = new Date("2007-12-30").getTime()
    if (this.props.loadingStatus === "loaded"){
      var transformedData = []
      var symbols = Object.keys(this.props.data)
      for (let symbol of symbols){
        transformedData[symbol] = Object.keys(this.props.data[symbol]["Monthly Adjusted Time Series"])
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
            parseFloat(this.props.data[symbol]["Monthly Adjusted Time Series"][date]["5. adjusted close"])
          ]
        })
        transformedData[symbol].sort((a,b) => (a[0]-b[0]))
      }
      return transformedData
    }
  }

  render(){
    const { color, holdingsType } = this.props
    let data = {}
    let symbols=[]

    if(this.props.data){
      data = this.transformDataForHighStocks(this.props.data)
      if(data){
        symbols = Object.keys(data)
      }
    }

    return(
      <StyledContainer>
        <HighchartsStockChart>
          <Chart
            zoomType="x"
            backgroundColor={color}
            textColor='rgba(255,255,255,1)'
            legendBackgroundColor= 'rgba(0, 0, 0, 0.8)'
            background2= '#FFFFFF'
            dataLabelsColor= '#FFFFFF'
            contrastTextColor= '#FFFFFF'
            maskColor= 'rgba(255,255,255,0.3)'
          />
          <Title style={{color: 'rgba(255,255,255,1)', fontWeight: 400, fontSize:'20px', margin: '10px'}}>{holdingsType}</Title>
          <XAxis gridLineColor='rgba(255,255,255,0.3)' labels={{style: { color: 'rgba(255,255,255,0.8)' }}}>
            <XAxis.Title style={{color: 'rgba(255,255,255,0.8)'}}>Time</XAxis.Title>
          </XAxis>
          <Tooltip valueSuffix=" CHF" shared valueDecimals={2}/>
          <YAxis id="shares-and-bonds" gridLineColor='rgba(255,255,255,0.3)' tickColor='rgba(255,255,255,0.8)' labels={{style: { color: 'rgba(255,255,255,0.8)' }}}>
            { symbols.map((symbol, index) => (
              <LineSeries id={symbol} name={symbol} data={data[symbol]} key={symbol} tooltip={{valueDecimals: 2}} compare="percent" color={`rgba(255,255,255,${(index/10)+0.5})`}/>
            ))}
          </YAxis>
        </HighchartsStockChart>
      </StyledContainer>
    )
  }
}

export default withHighcharts(LineChart, Highcharts);

const StyledContainer = styled.div`
  padding:10px;
`
