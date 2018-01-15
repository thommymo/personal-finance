import React, { Component } from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import { addInvestment } from '../../actions'

class AddInvestment extends Component {
  constructor(props){
    super(props)
    this.state = {
      type: "",
      name: "",
      y: 0,
      currency: "",
      interest: 0,
      exchange: "",
      symbol: "",
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event){
    const name = event.target.name
    const value = (name === "y" || name === "interest") ? parseFloat(event.target.value) : event.target.value
    this.setState({
      [name]: value
    })
  }

  handleSubmit(){
    this.props.dispatch(addInvestment(this.state))
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Type:
            <input type="text" name="type" value={this.state.type} onChange={this.handleChange} />
          </label>
          <label>
            Name:
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
          </label>
          <label>
            Y:
            <input type="text" name="y" value={this.state.y} onChange={this.handleChange} />
          </label>
          <label>
            Currency:
            <input type="text" name="currency" value={this.state.currency} onChange={this.handleChange} />
          </label>
          <label>
            Interest Rate:
            <input type="text" name="interest" value={this.state.interest} onChange={this.handleChange} />
          </label>
          <label>
            Exchange:
            <input type="text" name="exchange" value={this.state.exchange} onChange={this.handleChange} />
          </label>
          <label>
            Symbol:
            <input type="text" name="symbol" value={this.state.symbol} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }

}

const mapStateToProps = (state, props) => (
  {...state}
)

export default connect(mapStateToProps)(AddInvestment)
