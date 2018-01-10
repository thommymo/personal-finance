import React, { Component } from 'react'
import idb from 'idb'
import LineChart from './components/molecules/linechart'
import LineChartWithData from './components/data/linechartwithdata'
import PieChartWithData from './components/data/piechart-with-data'
import './utils/global-css'
import { portfolio, holdingsWithMarketPrice } from './data/data'
import { connect } from 'react-redux'
import { fetchExchangeRates } from './components/data/actions'



/*
TODO:
1. New Structure (Data and Visual representation should be separated)
2. Clean Coding Principles
3. Everything should be tested
*/

class App extends Component {
  constructor(){
    super()
    this.state = {
      shareprice: "loading",
      symbol: "JNK",
      allData: {},
      symbols: []
    }
  }

  componentDidMount(){
    const { dispatch } = this.props
    dispatch(fetchExchangeRates("CHF"))
  }

  //Get Data from IndexedDB
  //Let's assume for now that the data is never updated (TODO: Do this when data updates)



  render() {
    return (
      <div>
        <PieChartWithData portfolio={portfolio}/>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...state
});

export default connect(mapStateToProps)(App)
