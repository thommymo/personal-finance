import styled from 'styled-components'
import { theme } from '../../utils/theme'

export const Select = styled.select`
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

export const Input = styled.input`
  font: ${theme.font.fontFamily};
  font-weight: 100;
  width:100%;
  margin:0px;
  background-color: rgba(245,245,245,0.6);
  color: black;
  border: none;
  padding: 5px 2px;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  align-self: center;
  font-size: 14px;
  ${props => props.type === "number" ? "text-align:right;width:90px;": "text-align:left;"}
  ::selection{
    background-color: rgba(8,8,8,0.6);
    color: white;
  }
`

export const Option  = styled.option`

`
