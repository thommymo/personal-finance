import React from 'react'
import PropTypes from 'prop-types'
import { Button } from './button'

export const EditInvestmentButton = ({ editInvestment, holding }) => (
    <Button onClick={(event)=>editInvestment(holding)}>Edit</Button>
)

EditInvestmentButton.propTypes = {
  editInvestment: PropTypes.func.isRequired,
  holding: PropTypes.object.isRequired
}
