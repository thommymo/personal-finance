import styled from 'styled-components'
import { theme } from '../../utils/theme'

export const Table = styled.table`
  border-style: solid;
  border-width:10px;
  border-color:${theme.colors.white};
  color:${theme.colors.white};
  background-color:${props => props.color};
  width:100vw;
  border-collapse: collapse;
`
export const TableRow = styled.tr`
  margin:0;
  padding:0;
`
export const TableColumnHead = styled.th`
  border-bottom-color:${theme.colors.white};
  border-bottom-style: solid;
  border-bottom-width:4px;
  padding:10px;
`
export const TableColumn = styled.td`
  border-bottom-color:${theme.colors.white};
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-right-color:${theme.colors.white};
  border-right-style: solid;
  border-right-width: 1px;
  padding:10px;
`
export const TableColumnRightAlign = TableColumn.extend`
  text-align:right;
`
export const TableColumnFoot = TableColumn.extend`
  border-top-color:${theme.colors.white};
  border-top-style: solid;
  border-top-width:4px;
  font-weight:400;
`
export const TableColumnFootRightAlign = TableColumnRightAlign.extend`
  border-top-color:${theme.colors.white};
  border-top-style: solid;
  border-top-width:4px;
  font-weight:400;
`
