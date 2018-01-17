import React, { Component } from 'react'
import { Table, TableRow, TableColumnHead, TableColumn, TableColumnRightAlign, TableColumnFoot, TableColumnFootRightAlign } from '../atoms/table'
import {RemoveInvestment} from '../atoms/remove-investment-button'
import { EditInvestmentButton } from '../atoms/edit-investment-button'
import { SaveInvestmentButton } from '../atoms/save-investment-button'
import { CancelEditingInvestmentButton } from '../atoms/cancel-editing-investment-button'
class TableWithHoldings extends Component {
  constructor(props){
    super(props)
    this.state = {
      oldHolding: {},
      updatedHolding: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentDidUpdate(){
    const itemToBeEdited = this.props.portfolio.filter(item => item.editing===true)
    if(itemToBeEdited.length===1 && JSON.stringify(itemToBeEdited[0]) !== JSON.stringify(this.state.oldHolding)){
      this.setState({
        oldHolding: {...itemToBeEdited[0]},
        updatedHolding: {...itemToBeEdited[0]}
      })
    }
  }

  handleChange(event){
    const name = event.target.name
    const value = (name === "y" || name === "interest") ? parseFloat(event.target.value) : event.target.value
    this.setState({
      updatedHolding: {
        ...this.state.updatedHolding,
        [name]: value
      }
    })
    console.log(this.state.updatedHolding)
  }

  handleCancel(){
    //this.props.cancelUpdateInvestment()
  }

  handleSubmit(){
    const oldHolding = this.state.oldHolding
    const updatedHolding = this.state.updatedHolding
    console.log(oldHolding, updatedHolding);
    this.props.updateInvestment(oldHolding,updatedHolding)
  }

  render() {

    var { portfolio, portfolioSelection, color, currency, removeInvestment, editInvestment, saveInvestment, cancelEditingInvestment } = this.props

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
              <TableColumnHead></TableColumnHead>
            </TableRow>
          </thead>
          <tbody>
            { portfolio.map((holding, index) => {
              if(holding.editing){
                return(
                  <TableRow key={index}>
                    <TableColumn><input value={this.state.updatedHolding.name} onChange={this.handleChange} name="name" id="name"/></TableColumn>
                    <TableColumnRightAlign>{(holding.y/currency[holding.currency]).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
                    <TableColumnRightAlign>{(holding.interest).toLocaleString("de-CH", { style: 'percent', minimumFractionDigits: 2})}</TableColumnRightAlign>
                    <TableColumnRightAlign>{(holding.y*holding.interest/currency[holding.currency]).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
                    <TableColumnRightAlign>{(holding.y*holding.interest/currency[holding.currency]-holding.y*0.008).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
                    <TableColumnRightAlign>
                      <SaveInvestmentButton saveInvestment={(oldHolding, updatedHolding) => saveInvestment(oldHolding, updatedHolding)} oldHolding={this.state.oldHolding} updatedHolding={this.state.updatedHolding}/>
                      <CancelEditingInvestmentButton cancelEditingInvestment={(holding) => cancelEditingInvestment(holding)} holding={holding}/>
                    </TableColumnRightAlign>
                  </TableRow>
                )
              }else{
                return(
                  <TableRow key={index}>
                    <TableColumn>{holding.name}</TableColumn>
                    <TableColumnRightAlign>{(holding.y/currency[holding.currency]).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
                    <TableColumnRightAlign>{(holding.interest).toLocaleString("de-CH", { style: 'percent', minimumFractionDigits: 2})}</TableColumnRightAlign>
                    <TableColumnRightAlign>{(holding.y*holding.interest/currency[holding.currency]).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
                    <TableColumnRightAlign>{(holding.y*holding.interest/currency[holding.currency]-holding.y*0.008).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
                    <TableColumnRightAlign>
                      <EditInvestmentButton editInvestment={(holding) => editInvestment(holding)} holding={holding}/>
                      <RemoveInvestment removeInvestment={(holding) => removeInvestment(holding)} holding={holding}/>
                    </TableColumnRightAlign>
                  </TableRow>
                )
              }
            })}
          </tbody>
          <tfoot>
            <TableRow>
              <TableColumnFoot>Sum</TableColumnFoot>
              <TableColumnFootRightAlign>{sum.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
              <TableColumnFootRightAlign>{(sumInterest/sum).toLocaleString("de-CH", { style: 'percent', minimumFractionDigits: 2})}</TableColumnFootRightAlign>
              <TableColumnFootRightAlign>{sumInterest.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
              <TableColumnFootRightAlign>{sumInterestAfterInflation.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
              <TableColumnFootRightAlign></TableColumnFootRightAlign>
            </TableRow>
          </tfoot>
        </Table>
    )
  }
}

export default TableWithHoldings
