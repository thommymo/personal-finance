import React, { Component } from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import { addHolding } from '../../actions'
import { holdingsWithMarketPrice } from '../../data/data'

/*
  TODO: Data Validation in Form
*/

class AddInvestment extends Component {
  constructor(props){
    super(props)
    this.state = {
      type: "Cash",
      name: "",
      y: 0,
      currency: "CHF",
      interest: 0,
      exchange: "NYSE",
      symbol: "",
      show: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onEscape = this.onEscape.bind(this)
  }

  onEscape({ keyCode }) {
    if (keyCode === 27) {
      this.setState({
        type: "Cash",
        name: "",
        y: 0,
        currency: "CHF",
        interest: 0,
        exchange: "NYSE",
        symbol: "",
        show: false
      })
    }
  }

  handleChange(event){
    const name = event.target.name
    const value = (name === "y" || name === "interest") ? parseFloat(event.target.value) : event.target.value
    this.setState({
      [name]: value
    })
  }

  handleSubmit(){
    this.setState({
      show:false
    })
    this.props.dispatch(addHolding(this.state))
    this.setState({
      type: "Cash",
      name: "",
      y: 0,
      currency: "CHF",
      interest: 0,
      exchange: "NYSE",
      symbol: "",
    })
  }

  handleClick(){
    this.setState({
      show:true
    })
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onEscape);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEscape);
  }

  render() {
    const currencies = Object.keys(this.props.exchangeRates.rates)
    return (
      <StyledAddInvestment>
        { !this.state.show &&
          <Button><button onClick={this.handleClick}>Add Investment</button></Button>
        }
        { this.state.show &&
          <Overlay>
            <FormWrapper>
              <h1>Add Investment</h1>
              <StyledForm onSubmit={this.handleSubmit}>
                <FormElementWrapper>
                  <label htmlFor="type">
                    Type
                  </label>
                  <select value={this.state.type} name="type" id="type" onChange={this.handleChange}>
                    <option value="Cash">Cash</option>
                    <option value="Equities">Equities</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Coop">Coop</option>
                    <option value="Retirement Money">Retirement Money</option>
                    <option value="Private Loan">Private Loan</option>
                    <option value="Natural Resources">Natural Resources</option>
                    <option value="Other">Other</option>
                  </select>
                </FormElementWrapper>
                <FormElementWrapper>
                  <label htmlFor="name">
                    Name
                  </label>
                  <input type="text" name="name" value={this.state.name} id="name" onChange={this.handleChange} />
                </FormElementWrapper>
                <FormElementWrapper>
                  <label htmlFor="y">
                    { !holdingsWithMarketPrice.includes(this.state.type) &&
                `Value in ${this.state.currency}`
                    }
                    { holdingsWithMarketPrice.includes(this.state.type) &&
                `Number of Holdings`
                    }
                  </label>
                  <input type="text" name="y" value={this.state.y} id="y" onChange={this.handleChange} />
                </FormElementWrapper>
                <FormElementWrapper>
                  <label htmlFor="currency">
                    Currency
                  </label>
                  <select value={this.state.currency} name="currency" id="currency" onChange={this.handleChange}>
                    { currencies.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </FormElementWrapper>
                { !holdingsWithMarketPrice.includes(this.state.type) &&
                  <FormElementWrapper>
                    <label htmlFor="interest">
                      Interest Rate
                    </label>
                    <input type="text" name="interest" value={this.state.interest} id="interest" onChange={this.handleChange} />
                  </FormElementWrapper>
                }
                { holdingsWithMarketPrice.includes(this.state.type) &&
                  <FormElementWrapper>
                    <label htmlFor="exchange">
                      Exchange
                    </label>
                    <select value={this.state.exchange} name="exchange" id="exchange" onChange={this.handleChange}>
                      <option value="NYSE">NYSE</option>
                      <option value="SWX">SWX</option>
                    </select>
                  </FormElementWrapper>
                }
                { holdingsWithMarketPrice.includes(this.state.type) &&
                  <FormElementWrapper>
                    <label htmlFor="symbol">
                      Symbol
                    </label>
                    <input type="text" name="symbol" value={this.state.symbol} id="symbol" onChange={this.handleChange} />
                  </FormElementWrapper>
                }
                <ButtonRight><input type="submit" value="Submit" /></ButtonRight>
              </StyledForm>
            </FormWrapper>
          </Overlay>
        }
      </StyledAddInvestment>
    )
  }

}

const mapStateToProps = (state, props) => (
  {...state}
)

export default connect(mapStateToProps)(AddInvestment)

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(255,255,255,0.98);
  height: 100vh;
  width: 100vw
`

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`

const FormElementWrapper = styled.div`
  min-width: 300px;
  padding-bottom:30px;
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Button = styled.div`
  input, button {
    width:100%;
    background-color: white;
    color: black;
    border: 2px solid black;
    padding: 10px 24px;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
    align-self: center;
    font-size: 16px;
    :hover {
        background-color: black;
        color: white;
    }
  }
`
const ButtonRight = Button.extend`
  display: flex;
  justify-content: flex-end;
  margin:auto;
`
const StyledAddInvestment = styled.div`
  padding-bottom: 20px;
`
