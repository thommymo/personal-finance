import React, { Component } from 'react'
import { Table, TableRow, TableColumnHead, TableColumn, TableColumnRightAlign, TableColumnFoot, TableColumnFootRightAlign } from '../atoms/table'

class TableWithHoldings extends Component {
  render() {
    var { portfolio, holdingsWithMarketPrice, portfolioSelection, color } = this.props

    portfolio = portfolio.filter(holding => (holding.type === portfolioSelection))
    const sum = portfolio.reduce((acc, holding) => (acc+=holding.y),0)
    const sumInterest = portfolio.reduce((acc, holding) => (acc+=(holding.y*holding.interest)),0)
    const sumInterestAfterInflation = portfolio.reduce((acc, holding) => (acc+=(holding.y*holding.interest-holding.y*0.008)),0)
    return (
      <Table color={color}>
        <tbody>
          <TableRow>
            <TableColumnHead>Name</TableColumnHead>
            <TableColumnHead>Value in CHF</TableColumnHead>
            <TableColumnHead>Interest Rate</TableColumnHead>
            <TableColumnHead>2018</TableColumnHead>
            <TableColumnHead>After Inflation</TableColumnHead>
          </TableRow>
          { portfolio.map((holding, index) => (
            <TableRow key={index}>
              <TableColumn>{holding.name}</TableColumn>
              <TableColumnRightAlign>{(holding.y).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
              <TableColumnRightAlign>{(holding.interest).toLocaleString("de-CH", { style: 'percent', minimumFractionDigits: 2})}</TableColumnRightAlign>
              <TableColumnRightAlign>{(holding.y*holding.interest).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
              <TableColumnRightAlign>{(holding.y*holding.interest-holding.y*0.008).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
            </TableRow>
          ))}
          <TableRow>
            <TableColumnFoot>Sum</TableColumnFoot>
            <TableColumnFootRightAlign>{sum.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
            <TableColumnFootRightAlign>{(sumInterest/sum).toLocaleString("de-CH", { style: 'percent', minimumFractionDigits: 2})}</TableColumnFootRightAlign>
            <TableColumnFootRightAlign>{sumInterest.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
            <TableColumnFootRightAlign>{sumInterestAfterInflation.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
          </TableRow>
        </tbody>
      </Table>
    )
  }
}

export default TableWithHoldings
