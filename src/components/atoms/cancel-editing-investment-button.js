import React from 'react'
import PropTypes from 'prop-types'
import { Button } from './button'

export const CancelEditingInvestmentButton = ({ cancelEditingInvestment }) => (
    <Button onClick={(event)=>cancelEditingInvestment()}>Cancel</Button>
)

CancelEditingInvestmentButton.propTypes = {
  cancelEditingInvestment: PropTypes.func.isRequired
}
