import styled from 'styled-components'

export const Button = styled.button`
  width:100%;
  background-color: white;
  color: black;
  border: 2px solid black;
  padding: 8px;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  align-self: center;
  font-size: 14px;
  :hover {
      background-color: black;
      color: white;
  }
`
