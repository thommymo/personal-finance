import React, { Component } from 'react'
import { LineChart, Line, CartesianGrid, Tooltip, Legend, XAxis, YAxis} from 'recharts'
import * as d3 from 'd3'

export default class LineChartWithData extends Component {

  normalizeData(){
    //Normalizes Data so it starts with 100
  }


  getAveragePerformance(){
    //Should get weighted Performance based on all shares bought
    
  }

  getTicks(){
    //Should get appropriate Ticks based on min and max values
  }


  render(){
    var cardinal = d3.curveCatmullRom.alpha(1);
    console.log(this.props.data)
    return(
      <LineChart width={1400} height={800} data={this.props.data}>
        <Tooltip />
        <CartesianGrid stroke="#ddd" strokeDasharray="2 5"/>
        <Line type={cardinal} dataKey="value" stroke="#8884d8" strokeWidth="3" dot={false} activeDot={{ stroke: 'red', strokeWidth: 2, r: 3 }} /> />/>
        <Legend />
        <XAxis dataKey="name" />
        <YAxis tickCount="20" domain={['auto', 'auto']} ticks={[60,80,100,120,140,160,180]}/>
      </LineChart>
    )
  }
}
