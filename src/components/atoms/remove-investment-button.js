import React from 'react'
import PropTypes from 'prop-types'
import { Button } from './button'

export const RemoveInvestment = ({ removeInvestment, holding }) => (
    <Button onClick={(event)=>removeInvestment(holding)}>Remove</Button>
)

RemoveInvestment.propTypes = {
  removeInvestment: PropTypes.func.isRequired,
  holding: PropTypes.object.isRequired
}
