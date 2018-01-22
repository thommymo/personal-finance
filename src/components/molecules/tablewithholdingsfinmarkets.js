import React, { Component } from 'react'
import { Table, TableRow, TableColumnHead, TableColumn, TableColumnRightAlign, TableColumnFoot, TableColumnFootRightAlign } from '../atoms/table'
import { RemoveInvestment } from '../atoms/remove-investment-button'
import { EditInvestmentButton } from '../atoms/edit-investment-button'
import { SaveInvestmentButton } from '../atoms/save-investment-button'
import { CancelEditingInvestmentButton } from '../atoms/cancel-editing-investment-button'
import { Input, Select, Option } from '../atoms/forms'

class TableWithHoldingsFinMarkets extends Component {
  constructor(props){
    super(props)
    this.state = {
      oldHolding: {
        name: '',
        y: '',
        symbol: '',
        exchange: '',
        interest: 0,
        currency: ''
      },
      updatedHolding: {
        name: '',
        y: '',
        symbol: '',
        exchange: '',
        interest: 0,
        currency: ''
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    const value = event.target.value

    this.setState({
      updatedHolding: {
        ...this.state.updatedHolding,
        [name]: value
      }
    })
  }

  handleSubmit(){
    const oldHolding = this.state.oldHolding
    const updatedHolding = this.state.updatedHolding
    this.props.updateInvestment(oldHolding,updatedHolding)
  }

  render() {

    let {
      portfolio
    } = this.props

    const {
      portfolioSelection,
      color,
      currency,
      removeInvestment,
      editInvestment,
      saveInvestment,
      cancelEditingInvestment,
      shareValue
    } = this.props

    portfolio = portfolio.filter(holding => (holding.type === portfolioSelection))
    const sum = portfolio.reduce((acc, holding) => (acc+=(holding.y*shareValue[holding.symbol]/currency[holding.currency])),0)
    return (
      <form>
        <Table color={color}>
          <thead>
            <TableRow>
              <TableColumnHead>Name</TableColumnHead>
              <TableColumnHead>Symbol</TableColumnHead>
              <TableColumnHead>Currency</TableColumnHead>
              <TableColumnHead>Exchange</TableColumnHead>
              <TableColumnHead>Holdings</TableColumnHead>
              <TableColumnHead>Value in CHF</TableColumnHead>
              <TableColumnHead></TableColumnHead>
            </TableRow>
          </thead>
          <tbody>
            { portfolio.map((holding, index) => {
              if(holding.editing){
                return(
                  <TableRow key={index}>
                    <TableColumn>
                      <Input value={this.state.updatedHolding.name} onChange={this.handleChange} name="name" id="name" type="text"/>
                    </TableColumn>
                    <TableColumnRightAlign>
                      <Input value={this.state.updatedHolding.symbol} onChange={this.handleChange} name="symbol" id="symbol"/>
                    </TableColumnRightAlign>
                    <TableColumnRightAlign>
                      <Select value={this.state.updatedHolding.currency} name="currency" id="currency" onChange={this.handleChange}>
                        { Object.keys(currency).map(item => {
                          return <Option key={item} value={item}>{item}</Option>
                        })}
                      </Select>
                    </TableColumnRightAlign>
                    <TableColumnRightAlign>
                      <Select value={this.state.updatedHolding.exchange} name="exchange" id="exchange" onChange={this.handleChange}>

                        { ["SWX", "NYSE"].map(item => {
                          if(this.state.updatedHolding.exchange === item){
                            return <Option key={item} value={item}>{item}</Option>
                          } else {
                            return <Option key={item} value={item}>{item}</Option>
                          }
                        })}
                      </Select>
                    </TableColumnRightAlign>
                    <TableColumnRightAlign>
                      <Input value={this.state.updatedHolding.y} onChange={this.handleChange} name="y" type="number" id="y"/>
                    </TableColumnRightAlign>
                    <TableColumnRightAlign>{(parseFloat(this.state.updatedHolding.y)*shareValue[holding.symbol]/currency[holding.currency]).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
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
                    <TableColumnRightAlign>{holding.symbol}</TableColumnRightAlign>
                    <TableColumnRightAlign>{holding.currency}</TableColumnRightAlign>
                    <TableColumnRightAlign>{holding.exchange}</TableColumnRightAlign>
                    <TableColumnRightAlign>{(holding.y)}</TableColumnRightAlign>
                    <TableColumnRightAlign>{(holding.y*shareValue[holding.symbol]/currency[holding.currency]).toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnRightAlign>
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
              <TableColumnFoot></TableColumnFoot>
              <TableColumnFoot></TableColumnFoot>
              <TableColumnFoot></TableColumnFoot>
              <TableColumnFoot></TableColumnFoot>
              <TableColumnFootRightAlign>{sum.toLocaleString("de-CH", { style: 'currency', currency: 'CHF' })}</TableColumnFootRightAlign>
              <TableColumnFoot></TableColumnFoot>
            </TableRow>
          </tfoot>
        </Table>
      </form>
    )
  }
}

export default TableWithHoldingsFinMarkets
