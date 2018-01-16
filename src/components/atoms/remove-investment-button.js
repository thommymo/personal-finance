import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export const RemoveInvestment = ({ removeInvestment, holding }) => (
  <Button>
    <button onClick={(event)=>removeInvestment(holding)}>Remove</button>
  </Button>
)

RemoveInvestment.propTypes = {
  removeInvestment: PropTypes.func.isRequired,
  holding: PropTypes.object.isRequired
};

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
