import React, { Component } from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, Legend, XAxis, YAxis} from 'recharts'
import * as d3 from 'd3'

export default class LineChartWithData extends Component {
  constructor(){
    super()
    this.state = {
      shareprice: "loading",
      symbol: "JNK",
      symbols: []
    }
  }

  normalizeData(data){
    if (this.props.loadingStatus === "loaded"){
      var symbols = Object.keys(this.props.data)
      var normalizedData = []
      //Normalizes Data so it starts with 100
      var allUniqueDates = new Set()
      for(let symbol of symbols){
        //get all dates into one array (and remove duplicates)
        let dates = Object.keys(data[symbol])
        for(let date of dates){
          allUniqueDates.add(date)
        }
      }
      let allDates = [...allUniqueDates];
      allDates.reverse()
      return allDates.map(
        (currentValue, index, array) => {
          let obj = {name: currentValue}
          for(let symbol of symbols){
            if(data[symbol][currentValue]){
              obj[symbol] = parseFloat(data[symbol][currentValue]["5. adjusted close"])
            }
          }
          let sum = 0
          let counter = 0
          for (let symbol of symbols){
            if(obj[symbol]) {
              counter++
              sum+=obj[symbol]
            }
            obj.Average = sum/counter
          }
        return obj
      })
    }
  }


  getAveragePerformance(data){
    //Should get weighted Performance based on all shares bought
  }

  getTicks(){
    //Should get appropriate Ticks based on min and max values
  }

  componentDidMount(){
    //this.setState( {normalizedData: this.normalizeData(this.props.data) })
  }


  render(){
    //TODO: imported d3 just for this (I'm not sure why this is necessary, since recharts does use d3)
    var cardinal = d3.curveCardinal.tension(0.3);
    var data = {}
    if(this.props.data){
      data = this.normalizeData(this.props.data)
    }
    return(
      //TODO: this.normalizeData has to be moved in it's own component (maybe together with all that is in app.js now )
      <ResponsiveContainer width="80%" height={200}>
        <LineChart data={data}>
          <Tooltip />
          <CartesianGrid stroke="#ddd" strokeDasharray="2 5"/>
          {/*

            TODO: should not rerender, when new data arrives, should just update
            HINT: its not rerendering if I do not wrap the Line Component in a map function

          */}
          { this.props.symbols.map(symbol => (
            <Line key={symbol} type={cardinal} dataKey={symbol} stroke="#8884d8" strokeWidth="2" dot={false} activeDot={{ stroke: 'red', strokeWidth: 2, r: 3 }} />
          ))}
          <Line type={cardinal} dataKey="Average" stroke="black" strokeWidth="3" dot={false} activeDot={{ stroke: 'red', strokeWidth: 2, r: 3 }} />

          <Legend />
          <XAxis dataKey="name" />
          <YAxis tickCount={20} domain={[0, 200]} ticks={[0,10,20,30,40,50,100]}/>
        </LineChart>
      </ResponsiveContainer>
    )
  }
}
