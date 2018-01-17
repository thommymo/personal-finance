import React from 'react'
import PropTypes from 'prop-types'
import { Button } from './button'

export const SaveInvestmentButton = ({ saveInvestment, oldHolding, updatedHolding }) => (
    <Button onClick={(event)=>saveInvestment(oldHolding, updatedHolding)}>Save</Button>
)

SaveInvestmentButton.propTypes = {
  saveInvestment: PropTypes.func.isRequired,
  oldHolding: PropTypes.object.isRequired,
  updatedHolding: PropTypes.object.isRequired
}
