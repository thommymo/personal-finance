import React, { Component } from 'react'
import { portfolio, currency, holdingsWithMarketPrice, shareValue } from '../../data/data'
import PieChart from '../../components/molecules/piechart'

//Data will come from a database later, instead of the import from "../../data/data"
//

export const PieChartWithData = () => (
  <PieChart
    portfolio={portfolio}
    currency={currency}
    holdingsWithMarketPrice={holdingsWithMarketPrice}
    shareValue={shareValue}
  />
)
