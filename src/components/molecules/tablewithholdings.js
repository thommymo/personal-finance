import React, { Component } from 'react'
import { Table, TableRow, TableColumnHead, TableColumn, TableColumnRightAlign, TableColumnFoot, TableColumnFootRightAlign } from '../atoms/table'

class TableWithHoldings extends Component {
  render() {
    var { portfolio, portfolioSelection, color, currency } = this.props

    portfolio = portfolio.filter(holding => (holding.type === portfolioSelection))
    const sum = portfolio.reduce((acc, holding) => (acc+=holding.y),0)
    const sumInterest = portfolio.reduce((acc, holding) => (acc+=(holding.y*holding.interest/currency[holding.currency])),0)
    const sumInterestAfterInflation = portfolio.reduce((acc, holding) => (acc+=(holding.y*holding.interest/currency[holding.currency]-holding.y*0.008)),0)
    return (
      <Table color={color}>
        <thead>
          <TableRow>
            <TableColumnHead>Name</TableColumnHead>
            <TableColumnHead>Value in CHF</TableColumnHead>
            <TableColumnHead>Interest Rate</TableColumnHead>
            <TableColumnHead>2018</TableColumnHead>
            <TableColumnHead>After Inflation</TableColumnHead>
          </TableRow>
        </thead>
        <tbody>
          { portfolio.map((holding, index) => (
            <TableRow key={index}>
              <TableColumn>{holding.name}</TableColumn>
              <TableColumnRightAlign>{(holding.y/currency[holding.currency]).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
              <TableColumnRightAlign>{(holding.interest).toLocaleString("de-CH", { style: 'percent', minimumFractionDigits: 2})}</TableColumnRightAlign>
              <TableColumnRightAlign>{(holding.y*holding.interest/currency[holding.currency]).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
              <TableColumnRightAlign>{(holding.y*holding.interest/currency[holding.currency]-holding.y*0.008).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
            </TableRow>
          ))}
        </tbody>
        <tfoot>
          <TableRow>
            <TableColumnFoot>Sum</TableColumnFoot>
            <TableColumnFootRightAlign>{sum.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
            <TableColumnFootRightAlign>{(sumInterest/sum).toLocaleString("de-CH", { style: 'percent', minimumFractionDigits: 2})}</TableColumnFootRightAlign>
            <TableColumnFootRightAlign>{sumInterest.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
            <TableColumnFootRightAlign>{sumInterestAfterInflation.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
          </TableRow>
        </tfoot>
      </Table>
    )
  }
}

export default TableWithHoldings
