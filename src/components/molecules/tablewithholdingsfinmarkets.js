import React, { Component } from 'react'
import { Table, TableRow, TableColumnHead, TableColumn, TableColumnRightAlign, TableColumnFoot, TableColumnFootRightAlign } from '../atoms/table'

class TableWithHoldingsFinMarkets extends Component {
  render() {
    var { portfolio, portfolioSelection, color, shareValue, exchangeRates} = this.props

    portfolio = portfolio.filter(holding => (holding.type === portfolioSelection))
    const sum = portfolio.reduce((acc, holding) => (acc+=(holding.y*shareValue[holding.symbol]/exchangeRates[holding.currency])),0)
    return (
      <Table color={color}>
        <tbody>
          <TableRow>
            <TableColumnHead>Name</TableColumnHead>
            <TableColumnHead>Symbol</TableColumnHead>
            <TableColumnHead>Currency</TableColumnHead>
            <TableColumnHead>Holdings</TableColumnHead>
            <TableColumnHead>Value in CHF</TableColumnHead>
          </TableRow>
          { portfolio.map((holding, index) => (
            <TableRow key={index}>
              <TableColumn>{holding.name}</TableColumn>
              <TableColumn>{holding.symbol}</TableColumn>
              <TableColumn>{holding.currency}</TableColumn>
              <TableColumnRightAlign>{(holding.y)}</TableColumnRightAlign>
              <TableColumnRightAlign>{(holding.y*shareValue[holding.symbol]/exchangeRates[holding.currency]).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
            </TableRow>
          ))}
          <TableRow>
            <TableColumnFoot>Sum</TableColumnFoot>
            <TableColumnFoot></TableColumnFoot>
            <TableColumnFoot></TableColumnFoot>
            <TableColumnFoot></TableColumnFoot>
            <TableColumnFootRightAlign>{sum.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
          </TableRow>
        </tbody>
      </Table>
    )
  }
}

export default TableWithHoldingsFinMarkets
