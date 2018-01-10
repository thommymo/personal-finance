import React, { Component } from 'react'
import styled from 'styled-components'
import { theme } from '../../utils/theme'

class TableWithHoldings extends Component {
  render() {
    var { portfolio, holdingsWithMarketPrice, portfolioSelection, color } = this.props
    //TODO: Refactor
    portfolio=portfolio.filter(holding => (!holdingsWithMarketPrice.some((element) => (element === holding.type))))
    portfolio=portfolio.filter(holding => (holding.type === portfolioSelection))
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

const Table = styled.table`
  border-style: solid;
  border-width:10px;
  border-color:${theme.colors.white};
  color:${theme.colors.white};
  background-color:${props => props.color};
  width:100vw;
  border-collapse: collapse;
`
const TableRow = styled.tr`
  margin:0;
  padding:0;
`
const TableColumnHead = styled.th`
  border-bottom-color:${theme.colors.white};
  border-bottom-style: solid;
  border-bottom-width:4px;
  padding:10px;
`
const TableColumn = styled.td`
  border-bottom-color:${theme.colors.white};
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-right-color:${theme.colors.white};
  border-right-style: solid;
  border-right-width: 1px;
  padding:10px;
`
const TableColumnRightAlign = TableColumn.extend`
  text-align:right;
`
const TableColumnFoot = TableColumn.extend`
  border-top-color:${theme.colors.white};
  border-top-style: solid;
  border-top-width:4px;
  font-weight:400;
`
const TableColumnFootRightAlign = TableColumnRightAlign.extend`
  border-top-color:${theme.colors.white};
  border-top-style: solid;
  border-top-width:4px;
  font-weight:400;
`
