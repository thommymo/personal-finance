import styled from 'styled-components'

export const Button = styled.button`
  min-width:40%;
  margin:0 5px;
  background-color: rgba(245,245,245,0.8);
  color: black;
  border: 2px solid white;
  padding: 5px;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  align-self: center;
  font-size: 14px;
  :hover {
      background-color: black;
      color: white;
  }
`
